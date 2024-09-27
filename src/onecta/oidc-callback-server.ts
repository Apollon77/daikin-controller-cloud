
import type { IncomingMessage, ServerResponse } from 'node:http';

import { resolve } from 'node:path';
import { createServer, Server } from 'node:https';
import { readFile } from 'node:fs/promises';

import { address } from 'ip';

import { OnectaClientConfig, onecta_oidc_auth_thank_you_html } from './oidc-utils.js';
import { AddressInfo } from 'node:net';

export class OnectaOIDCCallbackServer {

    #config: OnectaClientConfig;
    #server: Server | null;
    #redirectUri: string | null;

    constructor(config: OnectaClientConfig) {
        this.#config = config;
        this.#server = null;
        this.#redirectUri = null;
    }

    async listen(): Promise<string> {
        const config = this.#config;
        const server = createServer({
            key: await readFile(
                config.certificatePathKey
                    ?? resolve(__dirname, '..', '..', 'cert', 'cert.key'),
            ),
            cert: await readFile(
                config.certificatePathCert
                    ?? resolve(__dirname, '..', '..', 'cert', 'cert.pem'),
            ),
        });
        await new Promise<void>((resolve, reject) => {
            const cleanup = () => {
                server.removeListener('listening', onListening);
                server.removeListener('error', onError);
            };
            const onListening = () => {
                cleanup();
                resolve();
            }
            const onError = (err: Error) => {
                cleanup();
                reject(err);
            };
            server.on('listening', onListening);
            server.on('error', onError);
            server.listen(
                config.oidcCallbackServerPort ?? 0,
                config.oidcCallbackServerBindAddr ?? '0.0.0.0',
            );
        });
        let callbackUrl = config.oidcCallbackServerBaseUrl;
        if (!callbackUrl) {
            const oidcHostname = config.oidcCallbackServerExternalAddress ?? address('public');
            const oidcPort = config.oidcCallbackServerPort ?? (server.address() as AddressInfo).port;
            callbackUrl = `https://${oidcHostname}:${oidcPort}`;
        }
        this.#server = server;
        this.#redirectUri = callbackUrl;
        return callbackUrl;
    }

    async waitForAuthCodeAndClose(oidc_state: string, auth_url: string): Promise<string> {
        const config = this.#config;
        const server = this.#server;
        if (!server?.listening) {
            throw new Error('server is not listening');
        }
        return await new Promise<string>((resolve, reject) => {
            let timeout: NodeJS.Timeout;
            const cleanup = () => {
                clearTimeout(timeout);
                server.removeListener('request', onRequest);
                server.removeListener('error', onError);
                server.closeAllConnections();
                server.close();
            };
            const onError = (err: Error) => {
                cleanup();
                reject(err);
            };
            const onTimeout = () => {
                cleanup();
                reject(new Error('Authorization time out'));
            };
            const onAuthCode = (code: string) => {
                cleanup();
                resolve(code);
            };
            const onRequest = (req: IncomingMessage, res: ServerResponse) => {
                const url = new URL(req.url ?? '/', this.#redirectUri!);
                const resState = url.searchParams.get('state');
                const authCode = url.searchParams.get('code');
                if (resState === oidc_state && authCode) {
                    res.statusCode = 200;
                    res.write(config.onectaOidcAuthThankYouHtml ?? onecta_oidc_auth_thank_you_html);
                    res.once('finish', () => onAuthCode(authCode));
                } else if (!resState && !authCode && (req.url ?? '/') === '/') {
                    // Redirect to auth_url
                    res.writeHead(302, {
                        'Location': auth_url,
                    });
                }
                else {
                    res.statusCode = 400;
                }
                res.end();
            };
            setTimeout(onTimeout, (config.oidcAuthorizationTimeoutS || 300) * 1000);
            server.on('request', onRequest);
            server.on('error', onError);
        });
    }

}
