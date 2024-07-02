
import { readFile, writeFile } from 'node:fs/promises';
import { EventEmitter } from 'node:events';
import { randomBytes } from 'node:crypto';
import { BaseClient, TokenSet } from 'openid-client';

import {
    OnectaOIDCScope,
    OnectaAPIBaseUrl,
    OnectaClientConfig,
    onecta_oidc_issuer,
    onecta_oidc_auth_thank_you_html,
} from './oidc-utils.js';

import {
    startOnectaOIDCCallbackServer,
} from './oidc-callback-server.js';

export class OnectaClient {

    private _config: OnectaClientConfig;
    private _client: BaseClient;
    private _token_set: TokenSet | null;
    private _emitter: EventEmitter;
    private _get_token_set_queue: { resolve: (set: TokenSet) => any, reject: (err: Error) => any }[];

    constructor(config: OnectaClientConfig, emitter: EventEmitter) {
        this._config = config;
        this._emitter = emitter;
        this._client = new onecta_oidc_issuer.Client({
            client_id: config.oidc_client_id,
            client_secret: config.oidc_client_secret,
        });
        this._token_set = null;
        this._get_token_set_queue = [];
    }

    private async _authorize(): Promise<TokenSet> {
        const { _config, _client } = this;
        const redirect_uri = _config.oidc_callback_server_baseurl;
        const req_state = randomBytes(32).toString('hex');
        const auth_url = _client.authorizationUrl({
            scope: OnectaOIDCScope.basic,
            state: req_state,
            redirect_uri,
        });
        this._emitter.emit('authorization_request', auth_url);
        const auth_code = await startOnectaOIDCCallbackServer(this._config, req_state);
        const token_set = await _client.grant({
            grant_type: 'authorization_code',
            client_id: _config.oidc_client_id,
            client_secret: _config.oidc_client_secret,
            code: auth_code,
            redirect_uri,
        });
        return token_set;
    }

    private async _refresh(refresh_token: string): Promise<TokenSet> {
        const { _client, _config } = this;
        const token_set = await _client.grant({
            grant_type: 'refresh_token',
            client_id: _config.oidc_client_id,
            client_secret: _config.oidc_client_secret,
            refresh_token,
        });
        return token_set;
    }

    private async _loadTokenSet(): Promise<TokenSet | null> {
        const { _config } = this;
        try {
            const data = await readFile(_config.oidc_tokenset_file_path, 'utf8');
            const token_set = new TokenSet(JSON.parse(data));
            return token_set;
        } catch (err) {
            if ((err as { code?: string }).code !== 'ENOENT') {
                this._emitter.emit('error', 'Could not load OIDC tokenset from disk: ' + (err as Error).message);
            }
            return null;
        }
    }

    private async _storeTokenSet(set: TokenSet): Promise<void> {
        const { _config } = this;
        try {
            await writeFile(_config.oidc_tokenset_file_path, JSON.stringify(set, null, 2));
        } catch (err) {
            this._emitter.emit('error', 'Could not store OIDC tokenset to disk: ' + (err as Error).message);
        }
    };


    private async _getTokenSet(): Promise<TokenSet> {
        let token_set: TokenSet | null = this._token_set;
        if (!token_set && (token_set = await this._loadTokenSet())){
            this._token_set = token_set;
        }
        if (!token_set || !token_set.refresh_token) {
            token_set = await this._authorize();
        } else if (!token_set.expires_at || token_set.expires_at < (Date.now() / 1000) + 10) {
            token_set = await this._refresh(token_set.refresh_token);
        }
        if (this._token_set !== token_set) {
            await this._storeTokenSet(token_set);
        }
        this._token_set = token_set;
        return token_set;
    }

    private async _getTokenSetQueued(): Promise<TokenSet> {
        return new Promise((resolve, reject) => {
            this._get_token_set_queue.push({ resolve, reject });
            if (this._get_token_set_queue.length === 1) {
                this._getTokenSet()
                    .then((token_set) => {
                        this._get_token_set_queue.forEach(({ resolve }) => resolve(token_set));
                        this._get_token_set_queue = [];
                    })
                    .catch((err) => {
                        this._get_token_set_queue.forEach(({ reject }) => reject(err));
                        this._get_token_set_queue = [];
                    });
            }
        });
    }

    async requestResource(path: string, opts?: Parameters<typeof BaseClient.prototype.requestResource>[2]): Promise<any> {
        const token_set = await this._getTokenSetQueued();
        const url = `${OnectaAPIBaseUrl.prod}${path}`;
        const res = await this._client.requestResource(url, token_set, opts);
        if (res.body) {
            return JSON.parse(res.body.toString());
        }
        return null;
    }

}
