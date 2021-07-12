const Mitm = require('http-mitm-proxy');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');
const http = require('http');
const path = require('path');
const fs = require('fs');

const { generators } = require('openid-client');

/**
 * Handle the Daikin Cloud Login process to retrieve tokens via a proxy
 */
class DaikinCloudProxy {
    /**
     * Constructior of Daikin cloud proxy class
     *
     * @param {any} openIdClient Initialized Client instance from openid-client.Client used for communication
     * @param {object} options Options objects
     * @param {object} options.proxyOwnIp Own external IP of the proxy for the final redirect (unused right now)
     * @param {string} [options.proxyListenBind='0.0.0.0'] Listen-Host setting for servers
     * @param {object} options.proxyPort=8888 Port for SSL-Proxy
     * @param {object} options.proxyWebPort=8889 Port for Webpage to download cert and start process
     * @param {object} options.proxyDataDir Data directory to store certificates and other needed files, defaults to library root directory
     * @param {function} [options.logger=console.log] Logger function
     * @param {string} [options.logLevel=info] Loglevel to use - in fact only "debug" has a meaning to log some more details
     */
    constructor(openIdClient, options) {
        this.openIdClient = openIdClient;
        this.options = options || {
            proxyOwnIp: '',
            proxyListenBind: '0.0.0.0',
            proxyPort: 8888,
            proxyWebPort: 8889,
            proxyDataDir: path.join(__dirname, '..'),
            logger: null
        };
        if (!this.options.logLevel) {
            this.options.logLevel = 'info';
        }
        this.openIdStore = {};
        this.proxyServer = null;

        this.resultPromise = null;
    }

    /**
     * Initialize and start the Proxy and Web Servers
     *
     * @returns {Promise<boolean>} Resuolved with true on success
     */
    startServer() {
        if (this.proxyServer) {
            throw new Error('Proxy Server already started. Please stop before starting again.');
        }
        if (this.resultPromise) {
            // this case should never happen
            this.resultPromise.reject(new Error('Proxy Server just started. Discard old process.'));
            this.resultPromise = null;
        }

        return new Promise((resolve, reject) => {
            // proxy middleware options
            // Create proxy server
            this.proxyServer = Mitm();

            this.proxyServer.onResponseHeaders(async (ctx, callback) => {
                if (ctx.serverToProxyResponse.headers) {
                    if ('strict-transport-security' in ctx.serverToProxyResponse.headers) {
                        ctx.serverToProxyResponse.headers['strict-transport-security'] = 'max-age=0';
                    }

                    if (
                        ctx.clientToProxyRequest.headers &&
                        ctx.clientToProxyRequest.headers.host &&
                        ctx.clientToProxyRequest.headers.host.includes('daikin') &&
                        ctx.serverToProxyResponse.headers.location &&
                        ctx.serverToProxyResponse.headers.location.startsWith('daikinunified://')) {
                        try {
                            const daikinTokenSet = await this._retrieveTokens(ctx.serverToProxyResponse.headers.location);
                            this.options.logger && this.options.logger('Daikin-Cloud: Token detection SUCCESS');

                            ctx.serverToProxyResponse.headers.location = `http://${this.options.proxyOwnIp}:${this.options.proxyWebPort}/success.html`;

                            if (this.resultPromise) {
                                this.resultPromise.resolve(daikinTokenSet);
                                this.resultPromise = null;
                            }
                        } catch (err) {
                            this.options.logger && this.options.logger('Daikin-Cloud: Token detection ERROR: ' +  err);

                            ctx.serverToProxyResponse.headers.location = `http://${this.options.proxyOwnIp}:${this.options.proxyWebPort}/error.html`;

                            if (this.resultPromise) {
                                this.resultPromise.reject(err);
                                this.resultPromise = null;
                            }
                        }
                    }
                }
                return callback();

            });
            this.proxyServer.onRequest((ctx, callback) => {
                ctx.onResponse((ctx, callback) => {
                    ctx.proxyToServerRequest.socket.once('close', () => {
                        ctx.clientToProxyRequest.socket.destroy()
                    });
                    return callback();
                });

                this.options.logger && this.options.logLevel === 'debug' && this.options.logger('Daikin-Cloud: Proxy process request for ' + (ctx && ctx.clientToProxyRequest) ? ctx.clientToProxyRequest.url : '');

                /*
                // When a request is done to a hostname that contains "daikin" in the name
                if (ctx.clientToProxyRequest.headers && ctx.clientToProxyRequest.headers.host && ctx.clientToProxyRequest.headers.host.includes('daikin')) {
                    ctx.onResponseEnd(async (ctx, callback) => {
                        // this is the final redirect at the end of the Login process, grab the data
                    });
                }*/

                return callback();
            });

            this.proxyServer.onError((ctx, err) => {
                if (err && err.code === 'ECONNRESET' || err.code === 'ERR_SSL_UNSUPPORTED_PROTOCOL' || err.code === 'ECONNREFUSED' || err.code === 'EPIPE'  ) { // ignore
                    return;
                }
                const  url = (ctx && ctx.clientToProxyRequest) ? ctx.clientToProxyRequest.url : '';
                this.options.logger && this.options.logger('Daikin-Cloud: SSL-Proxy ERROR for ' + url +  ' : ' + err);
                this.options.logger && this.options.logger(err.code + ': ' + err.stack);
            });

            const proxyOptions = {
                host: this.options.proxyListenBind || undefined,
                port: this.options.proxyPort,
                sslCaDir: this.options.proxyDataDir,
                keepAlive: true,
                timeout: 5000
            };
            this.proxyServer.listen(proxyOptions, () => {
                // Create server for downloading certificate
                const serve = serveStatic(path.join(this.options.proxyDataDir, 'certs'), {});

                // Create server
                this.staticServer = http.createServer((req, res) => {
                    serve(req, res, finalhandler(req, res));
                });

                this.staticServer.on('error', err => {
                    this.options.logger && this.options.logger('SSL-Proxy could not be started: ' + err);
                    this.options.logger && this.options.logger(err.stack);
                    this.proxyServer.close(() => {
                        this.proxyServer = null;
                        this.staticServer.close(() => {
                            this.staticServer = null;
                            reject(err);
                        });
                    });
                });

                const staticOptions = {
                    port: this.options.proxyWebPort,
                    host: this.options.proxyListenBind
                };
                this.staticServer.listen(staticOptions, () => {
                    const startLink = this._generateInitialUrl();
                    const indexFile = `
                        <html lang="en">
                            <body>
                                <h2>Daikin-Cloud Token Retrieval</h2>
                                <b>
                                    Setup Step 1: <a href="./ca.pem">Download and install SSL Proxy Certificate</a> (depending on your browser and OS)
                                    <p/>
                                    Setup Step 2: Trust the certificate provider/profile "NodeMITMProxyCA" in your OS/Browser and activate it 
                                    <p/>
                                    Setup Step 3: Setup your device to use ${this.options.proxyOwnIp} and Port ${this.options.proxyPort} as proxy for all HTTP/HTTPS traffic
                                    <p/>
                                    <p/>
                                    Login: <a href="${startLink}">Login into the Daikin Cloud to retrieve the tokens</a>
                                </b>
                            </body>
                        </html>
                    `;
                    fs.writeFileSync(path.join(this.options.proxyDataDir, 'certs/index.html'), indexFile);

                    const successFile = `
                        <html lang="en">
                            <body>
                                <h1>Login successfully Done.</h1>
                                <p/>
                                <b>You can close this page and deactivate the Proxy and remove the certificate.</b>
                            </body>
                        </html>
                    `;
                    fs.writeFileSync(path.join(this.options.proxyDataDir, 'certs/success.html'), successFile);

                    const errorFile = `
                        <html lang="en">
                            <body>
                                <h1>An error happened while retrieving tokens. Please check the logs.</h1>
                            </body>
                        </html>
                    `;
                    fs.writeFileSync(path.join(this.options.proxyDataDir, 'certs/error.html'), errorFile);

                    resolve(true);
                });
            });
        });
    }

    /**
     * Stop the Proxy and Webserver
     * Please note that there is curently no guarantee that the proxy Server
     * is really closed when this method resolves. This is a limitation of the
     * used proxy server
     *
     * @returns {Promise<boolean>} resolve with true on success
     */
    stopServer() {
        return new Promise((resolve) => {
            if (this.resultPromise) {
                this.resultPromise.reject(new Error('Proxy Server stopped.'));
                this.resultPromise = null;
            }
            if (this.proxyServer) {
                this.proxyServer.close();
                this.proxyServer = null;
                this.staticServer.close(() => {
                    this.staticServer = null;
                    resolve(true);
                });
            } else {
                resolve();
            }
        });
    }

    /**
     * Create a deferred promise that resolves as soon as the user successfully logged in into Daikin Cloud
     *
     * Note: This promise could be resolved as soon as the final redirect is received from server but before
     * the browser shows it, so add a delay after this method before you close the proxy server.
     *
     * @returns {Promise<any>} Instance of openid-client.TokenSet with the Tokens for further communication
     */
    waitForTokenResponse() {
        let res;
        let rej;

        this.resultPromise = new Promise((resolve, reject) => {
            res = resolve;
            rej = reject;
        });

        this.resultPromise.resolve = res;
        this.resultPromise.reject = rej;

        return this.resultPromise;
    }

    /**
     * Create Initial URL to start a OpenID Login process with Daikin Cloud
     * @returns {string} URL
     * @private
     */
    _generateInitialUrl() {
        const codeVerifier = generators.codeVerifier();
        const codeChallenge = generators.codeChallenge(codeVerifier);
        const state = generators.state();

        this.openIdStore[state] = {
            code_verifier: codeVerifier
        };

        return this.openIdClient.authorizationUrl({
            scopes: 'email,openid,profile',
            state,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
        });
    }

    /**
     * Use the Callback URL to retrieve the needed Tokens
     * @param {string} callbackUrl Callback url from final redirect of Login process
     * @returns {Promise<any>} Instance of openid-client.TokenSet with tokens
     * @private
     */
    async _retrieveTokens(callbackUrl) {
        const params = this.openIdClient.callbackParams(callbackUrl);

        if (!this.openIdStore[params.state]) {
            throw new Error('Can not decode response for State ' + params.state + '. Please reload start page and try again!');
        }

        if (params.code) {
            const callbackParams = {
                code_verifier: this.openIdStore[params.state].code_verifier,
                state: params.state
            }

            const tokenSet = await this.openIdClient.oauthCallback('daikinunified://login', params, callbackParams);
            this.options.logger && this.options.logLevel === 'debug' && this.options.logger('Daikin-Cloud: received and validated tokens: ' + JSON.stringify(tokenSet));
            this.options.logger && this.options.logLevel === 'debug' && this.options.logger('Daikin-Cloud: validated ID Token claims: ' + JSON.stringify(tokenSet.claims()));
            return tokenSet;
        }
        else if (params.error) {
            this.options.logger && this.options.logger('Daikin-Cloud: ERROR: ' + JSON.stringify(params));
            throw new Error(params.error + ': ' + params.error_description);
        }
    }
}

module.exports = DaikinCloudProxy;