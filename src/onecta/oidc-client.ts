
import { readFile, writeFile } from 'node:fs/promises';
import { EventEmitter } from 'node:events';
import { randomBytes } from 'node:crypto';
import { BaseClient, TokenSet } from 'openid-client';

import {
    OnectaOIDCScope,
    OnectaAPIBaseUrl,
    OnectaClientConfig,
    onecta_oidc_issuer,
} from './oidc-utils.js';

import {
    startOnectaOIDCCallbackServer,
} from './oidc-callback-server.js';

export class OnectaClient {
    #config: OnectaClientConfig;
    #client: BaseClient;
    #tokenSet: TokenSet | null;
    #emitter: EventEmitter;
    #getTokenSetQueue: { resolve: (set: TokenSet) => any, reject: (err: Error) => any }[];

    constructor(config: OnectaClientConfig, emitter: EventEmitter) {
        this.#config = config;
        this.#emitter = emitter;
        this.#client = new onecta_oidc_issuer.Client({
            client_id: config.oidcClientId,
            client_secret: config.oidcClientSecret,
        });
        this.#tokenSet = config.tokenSet ? new TokenSet(config.tokenSet) : null;
        this.#getTokenSetQueue = [];
        if (!config.oidcCallbackServerBaseUrl) {
            config.oidcCallbackServerBaseUrl =
                `https://${config.oidcCallbackServerExternalAddress ?? 
                    config.oidcCallbackServerBindAddr}:${config.oidcCallbackServerPort}`;
        }
    }

    async #authorize(): Promise<TokenSet> {
        const redirectUri = this.#config.oidcCallbackServerBaseUrl;
        const reqState = randomBytes(32).toString('hex');
        const authUrl = this.#client.authorizationUrl({
            scope: OnectaOIDCScope.basic,
            state: reqState,
            redirect_uri: redirectUri,
        });
        this.#emitter.emit('authorization_request', this.#config.oidcCallbackServerBaseUrl);
        const authCode =
            this.#config.customOidcCodeReceiver
                ? await this.#config.customOidcCodeReceiver(authUrl, reqState)
                : await startOnectaOIDCCallbackServer(this.#config, reqState, authUrl);
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

    async requestResource(path: string, opts?: Parameters<typeof BaseClient.prototype.requestResource>[2]): Promise<any> {
        const tokenSet = await this.#getTokenSetQueued();
        const url = `${OnectaAPIBaseUrl.prod}${path}`;
        const res = await this.#client.requestResource(url, tokenSet, opts);
        if (res.body) {
            return JSON.parse(res.body.toString());
        }
        return null;
    }

}
