
import { IncomingMessage } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { EventEmitter } from 'node:events';
import { randomBytes } from 'node:crypto';
import { BaseClient, TokenSet, custom } from 'openid-client';
import {
    OnectaOIDCScope,
    OnectaAPIBaseUrl,
    OnectaClientConfig,
    onecta_oidc_issuer,
    OnectaRateLimitStatus,
    maybeParseInt,
    RESOLVED,
} from './oidc-utils.js';
import { OnectaOIDCCallbackServer } from './oidc-callback-server.js';
import { RateLimitedError } from "../index";

type RequestParameters = Parameters<typeof BaseClient.prototype.requestResource>[2] & {
    ignoreRateLimit?: boolean;
}

const ONE_DAY_S = 24 * 60 * 60;

custom.setHttpOptionsDefaults({
    timeout: 10_000, // Default 3.5s is too less sometimes as it seems
});

export class OnectaClient {

    #config: OnectaClientConfig;
    #client: BaseClient;
    #tokenSet: TokenSet | null;
    #emitter: EventEmitter;
    #getTokenSetQueue: { resolve: (set: TokenSet) => any, reject: (err: Error) => any }[];
    #blockedUntil: number = 0;

    constructor(config: OnectaClientConfig, emitter: EventEmitter) {
        this.#config = config;
        this.#emitter = emitter;
        this.#client = new onecta_oidc_issuer.Client({
            client_id: config.oidcClientId,
            client_secret: config.oidcClientSecret,
        });
        this.#tokenSet = config.tokenSet ? new TokenSet(config.tokenSet) : null;
        this.#getTokenSetQueue = [];
    }

    get blockedUntil(): number {
        return this.#blockedUntil;
    }

    async #getAuthCodeWithCustomReceiver(): Promise<{ authCode: string, redirectUri: string }> {
        const { customOidcCodeReceiver: receiver, oidcCallbackServerBaseUrl: redirectUri } = this.#config;
        if (!receiver || !redirectUri) {
            throw new Error('Config params "customOidcCodeReceiver" and "oidcCallbackServerBaseUrl" are both required when using a custom OIDC authorization grant receiver');
        }
        const reqState = randomBytes(32).toString('hex');
        const authUrl = this.#client.authorizationUrl({
            scope: OnectaOIDCScope.basic,
            state: reqState,
            redirect_uri: redirectUri,
        });
        return { authCode: await receiver(authUrl, reqState), redirectUri };
    }

    async #getAuthCodeWithServer(): Promise<{ authCode: string, redirectUri: string }> {
        const reqState = randomBytes(32).toString('hex');
        const server = new OnectaOIDCCallbackServer(this.#config);
        const redirectUri = await server.listen();
        const authUrl = this.#client.authorizationUrl({
            scope: OnectaOIDCScope.basic,
            state: reqState,
            redirect_uri: redirectUri,
        });
        this.#emitter.emit('authorization_request', redirectUri);
        return { authCode: await server.waitForAuthCodeAndClose(reqState, authUrl), redirectUri };
    }

    async #authorize(): Promise<TokenSet> {
        const config = this.#config;
        const { authCode, redirectUri } = config.customOidcCodeReceiver
            ? await this.#getAuthCodeWithCustomReceiver() : await this.#getAuthCodeWithServer();
        return await this.#client.grant({
            grant_type: 'authorization_code',
            client_id: this.#config.oidcClientId,
            client_secret: this.#config.oidcClientSecret,
            code: authCode,
            redirect_uri: redirectUri,
        });
    }

    async #refresh(refreshToken: string): Promise<TokenSet> {
        return await this.#client.grant({
            grant_type: 'refresh_token',
            client_id: this.#config.oidcClientId,
            client_secret: this.#config.oidcClientSecret,
            refresh_token: refreshToken,
        });
    }

    async #loadTokenSet(): Promise<TokenSet | null> {
        if (this.#config.oidcTokenSetFilePath) {
            try {
                const data = await readFile(this.#config.oidcTokenSetFilePath, 'utf8');
                return new TokenSet(JSON.parse(data));
            } catch (err) {
                if ((err as { code?: string }).code !== 'ENOENT') {
                    this.#emitter.emit('error', 'Could not load OIDC tokenset from disk: ' + (err as Error).message);
                }
            }
        }
        return null;
    }

    async #storeTokenSet(set: TokenSet): Promise<void> {
        this.#emitter.emit('token_update', set);
        if (this.#config.oidcTokenSetFilePath) {
            try {
                await writeFile(this.#config.oidcTokenSetFilePath, JSON.stringify(set, null, 2));
            } catch (err) {
                this.#emitter.emit('error', 'Could not store OIDC tokenset to disk: ' + (err as Error).message);
            }
        }
    };


    async #getTokenSet(): Promise<TokenSet> {
        let tokenSet: TokenSet | null = this.#tokenSet;
        if (!tokenSet && (tokenSet = await this.#loadTokenSet())){
            this.#tokenSet = tokenSet;
        }
        if (!tokenSet || !tokenSet.refresh_token) {
            tokenSet = await this.#authorize();
        } else if (!tokenSet.expires_at || tokenSet.expires_at < (Date.now() / 1000) + 10) {
            tokenSet = await this.#refresh(tokenSet.refresh_token);
        }
        if (this.#tokenSet !== tokenSet) {
            await this.#storeTokenSet(tokenSet);
        }
        this.#tokenSet = tokenSet;
        return tokenSet;
    }

    async #getTokenSetQueued(): Promise<TokenSet> {
        return new Promise((resolve, reject) => {
            this.#getTokenSetQueue.push({ resolve, reject });
            if (this.#getTokenSetQueue.length === 1) {
                this.#getTokenSet()
                    .then((tokenSet) => {
                        this.#getTokenSetQueue.forEach(({ resolve }) => resolve(tokenSet));
                        this.#getTokenSetQueue = [];
                    })
                    .catch((err) => {
                        this.#getTokenSetQueue.forEach(({ reject }) => reject(err));
                        this.#getTokenSetQueue = [];
                    });
            }
        });
    }

    #getRateLimitStatus(res: IncomingMessage): OnectaRateLimitStatus {
        // See "Rate limitation" at https://developer.cloud.daikineurope.com/docs/b0dffcaa-7b51-428a-bdff-a7c8a64195c0/general_api_guidelines
        return {
            limitMinute: maybeParseInt(res.headers['x-ratelimit-limit-minute']),
            remainingMinute: maybeParseInt(res.headers['x-ratelimit-remaining-minute']),
            limitDay: maybeParseInt(res.headers['x-ratelimit-limit-day']),
            remainingDay: maybeParseInt(res.headers['x-ratelimit-remaining-day']),
        };
    }

    async requestResource(path: string, opts?: RequestParameters): Promise<any> {
        if (!opts?.ignoreRateLimit && this.#blockedUntil > Date.now()) {
            const retryAfter = Math.ceil((this.#blockedUntil - Date.now()) / 1000);
            throw new RateLimitedError(`API request blocked because of rate-limits for ${retryAfter} seconds`, retryAfter);
        }
        const reqOpts = { ...opts };
        delete reqOpts.ignoreRateLimit;
        const tokenSet = await this.#getTokenSetQueued();
        const url = `${OnectaAPIBaseUrl.prod}${path}`;
        const res = await this.#client.requestResource(url, tokenSet, reqOpts);
        RESOLVED.then(() => this.#emitter.emit('rate_limit_status', this.#getRateLimitStatus(res)));
        switch (res.statusCode) {
            case 200:
            case 204:
                return res.body ? JSON.parse(res.body.toString()) :  null;
            case 400:
                throw new Error(`Bad Request (400): ${res.body ? res.body.toString() : 'No body response from the API'}`);
            case 404:
                throw new Error(`Not Found (404): ${res.body ? res.body.toString() : 'No body response from the API'}`);
            case 409:
                throw new Error(`Conflict (409): ${res.body ? res.body.toString() : 'No body response from the API'}`);
            case 422:
                throw new Error(`Unprocessable Entity (422): ${res.body ? res.body.toString() : 'No body response from the API'}`);
            case 429: {
                // See "Rate limitation" at https://developer.cloud.daikineurope.com/docs/b0dffcaa-7b51-428a-bdff-a7c8a64195c0/general_api_guidelines
                const retryAfter = maybeParseInt(res.headers['retry-after']);
                let blockedFor = retryAfter;
                if (retryAfter !== undefined) {
                    blockedFor = retryAfter > ONE_DAY_S ? ONE_DAY_S : retryAfter;
                    this.#blockedUntil = Date.now() + blockedFor * 1000;
                }
                throw new RateLimitedError(`API request rate-limited, retry after ${retryAfter} seconds. API requests blocked for ${blockedFor} seconds`, blockedFor);
            }
            case 500:
            default:
                throw new Error(`Unexpected API error`);
        }
    }

}
