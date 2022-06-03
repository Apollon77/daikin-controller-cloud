const EventEmitter = require('events');
const { Issuer, TokenSet, custom } = require('openid-client');
const got = require('got');
const path = require('path');
const DaikinCloudDevice = require('./lib/device');

let Proxy;

/**
 * Daikin Controller for Cloud solution to get tokens and interact with devices
 */
class DaikinCloudController extends EventEmitter {
    /**
     * Constructor for Daikin Cloud Controller
     * @param {object} tokenSet JSON or instance of openid-client.TokenSet with the already known communication tokens
     * @param {object} options Options objects
     * @param {object} [options.proxyOwnIp] Own external IP of the proxy for the final redirect (unused right now)
     * @param {string} [options.proxyListenBind='0.0.0.0'] Listen-Host setting for servers
     * @param {object} [options.proxyPort=8888] Port for SSL-Proxy
     * @param {object} [options.proxyWebPort=8889] Port for Webpage to download cert and start process
     * @param {object} [options.proxyDataDir] Data directory to store certificates and other needed files, defaults to library root directory
     * @param {function} [options.logger=console.log] Logger function
     * @param {string} [options.logLevel=info] Loglevel to use - in fact only "debug" has a meaning to log some more details
     * @param {number} options.communicationTimeout=10000 Timeout in ms for Requests & Responses to Cloud
     * @param {number} options.communicationRetries=3 Number of Retries if Authentication Requests timed out
     */
    constructor(tokenSet, options) {
        super();
        if (tokenSet && (!tokenSet.refresh_token && !tokenSet.access_token)) {
            options = tokenSet;
            tokenSet = null;
        }
        options = options || {};
        this.options = Object.assign({
            logger: null,
            logLevel: 'info'
        }, options);

        if (!this.options.logLevel) {
            this.options.logLevel = 'info';
        }
        if (!this.options.communicationRetries) {
            this.options.communicationRetries = 3;
        }
        if (!this.options.communicationTimeout) {
            this.options.communicationTimeout = 10000;
        }

        if (tokenSet && !(tokenSet instanceof TokenSet)) {
            tokenSet = new TokenSet(tokenSet);
        }
        this.tokenSet = tokenSet;

        // initialize OpenID Issuer with Daikin relevant details
        this.openIdIssuer = new Issuer({
            issuer: 'https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_SLI9qJpc7',
            authorization_endpoint: 'https://daikin-unicloud-prod.auth.eu-west-1.amazoncognito.com/oauth2/authorize',
            token_endpoint: 'https://daikin-unicloud-prod.auth.eu-west-1.amazoncognito.com/oauth2/token',
            token_endpoint_auth_methods_supported: ['none']
        });

        // initialize OpenID Client with Daikin relevant details
        this.openIdClientId = '7rk39602f0ds8lk0h076vvijnb';
        this.openIdClient = new this.openIdIssuer.Client({
            client_id: this.openIdClientId,
            redirect_uris: ['daikinunified://login'],
            response_types: ['code'],
            // id_token_signed_response_alg (default "RS256")
            token_endpoint_auth_method: 'none' // (default 'client_secret_basic')
        });

        // enhance got client with additional logging for debug mode
        custom.setHttpOptionsDefaults({
            timeout: this.options.communicationTimeout,
        });
    }

    /**
     * Initialize and Start Proxy and Web Server
     /**
     * Constructor for Daikin Cloud Controller
     * @param {object} [options] Options objects, if provided will overwrite these settings for the proxy, else ones from main object are used
     * @param {string} [options.proxyOwnIp] Own external IP of the proxy for the final redirect (use to override the external IP of the proxy)
     * @param {string} [options.proxyListenBind='0.0.0.0'] Listen-Host setting for servers
     * @param {number} [options.proxyPort=8888] Port for SSL-Proxy
     * @param {object} [options.proxyWebPort=8889] Port for Webpage to download cert and start process
     * @param {object} [options.proxyDataDir] Data directory to store certificates and other needed files, defaults to library root directory
     * @param {function} [options.logger=console.log] Logger function
     * @param {string} [options.logLevel=info] Loglevel to use - in fact only "debug" has a meaning to log some more details
     * @returns {Promise<boolean>} Resolves with true if server was started successfully
     */
    async initProxyServer(options) {
        Proxy = Proxy || require('./lib/proxy');

        if (!this.proxy) {
            options = options || {};
            const proxyOptions = Object.assign({
                proxyOwnIp: '',
                proxyListenBind: '0.0.0.0',
                proxyPort: 8888,
                proxyWebPort: 8889,
                proxyDataDir: path.join(__dirname),
            }, this.options, options);

            this.proxy = new Proxy(this.openIdClient, proxyOptions);
        }

        return this.proxy.startServer();
    }

    /**
     * Create a deferred promise that resolves as soon as the user successfully logged in into Daikin Cloud
     *
     * @emits DaikinCloudController#token_update
     * @returns {Promise<TokenSet>} Instance of openid-client.TokenSet with the Tokens for further communication
     */
    async waitForTokenFromProxy() {
        this.tokenSet = await this.proxy.waitForTokenResponse();
        /**
         * Inform the using application about changed Tokens (in this case it are new received tokens)
         * to store on application side
         *
         * @event DaikinCloudController#token_update
         * @property {TokenSet} Instance of openid-client-TokenSet with updated tokens
         **/
        this.emit('token_update', this.tokenSet);
        return this.tokenSet;
    }

    /**
     * Stop the Proxy and Webserver
     *
     * @returns {Promise<boolean>} resolve with true on success
     */
    async stopProxyServer() {
        if (!this.proxy) {
            return true;
        }
        return this.proxy.stopServer();
    }

    /**
     * Refresh the tokens
     * This method normally is called automatically if a 401 response is received,
     * so should not be needed to be called manually
     *
     * On Error the got response is included as property "response"  in Error object
     *
     * @emits DaikinCloudController#token_update
     * @returns {Promise<TokenSet>}
     */
    async refreshAccessToken() {
        const response = await got.post('https://cognito-idp.eu-west-1.amazonaws.com', {
            headers: {
                'Content-Type': 'application/x-amz-json-1.1',
                'x-amz-target': 'AWSCognitoIdentityProviderService.InitiateAuth',
                'x-amz-user-agent': 'aws-amplify/0.1.x react-native',
                'User-Agent': 'Daikin/1.6.1.4681 CFNetwork/1220.1 Darwin/20.3.0'
            },
            json: {
                'ClientId': this.openIdClientId,
                'AuthFlow': 'REFRESH_TOKEN_AUTH',
                'AuthParameters': {
                    'REFRESH_TOKEN': this.tokenSet.refresh_token
                }
            },
            responseType: 'json',
            hooks: {
                beforeRequest: [
                    (options) => {
                        if (this.options.logLevel === 'debug') {
                            console.log('<-- %s %s', options.method.toUpperCase(), options.url.href);
                            console.log('<-- HEADERS %o', options.headers);
                            if (options.body) {
                                console.log('<-- BODY %s', options.body);
                            }
                        }
                    },
                ],
                afterResponse: [
                    (response) => {
                        if (this.options.logLevel === 'debug') {
                            console.log('--> %i FROM %s %s', response.statusCode, response.request.options.method.toUpperCase(), response.request.options.url.href);
                            console.log('--> HEADERS %o', response.headers);
                            if (response.body) {
                                console.log('--> BODY %s', response.body);
                            }
                        }
                        return response;
                    }
                ]
            },
            timeout: {
                response: this.options.communicationTimeout,
                request: this.options.communicationTimeout
            },
            retry: {
                retries: this.options.communicationRetries,
                errorCodes: ['ETIMEDOUT'],
                methods: ['GET', 'POST']
            }
        });

        if (response.body && response.body.AuthenticationResult && response.body.AuthenticationResult.AccessToken && response.body.AuthenticationResult.TokenType === 'Bearer') {
            this.tokenSet.access_token = response.body.AuthenticationResult.AccessToken;
            this.tokenSet.id_token = response.body.AuthenticationResult.IdToken;
            this.tokenSet.access_token = response.body.AuthenticationResult.AccessToken;
            this.tokenSet.expires_at = ~~(Date.now() / 1000) + response.body.AuthenticationResult.ExpiresIn * 1000;
            this.emit('token_update', this.tokenSet);
            return this.tokenSet;
        }
        const err = new Error('Token refresh was not successful! ' + response.statusCode);
        err.response = response;
        throw err;
    }

    /**
     * Do a Bearer token authenticated request against Daikin cloud
     * with auto token refresh if needed
     *
     * On Error the got response is included as property "response"  in Error object
     *
     * @param {string} resourceUrl URL to access
     * @param {object} [options] Call options
     * @param {boolean} [refreshed] internal flag if the call is a second try after token refresh
     * @returns {Promise<object>} Data returned by daikin cloud
     */
    async doBearerRequest(resourceUrl, options, refreshed) {
        if (!this.tokenSet) {
            throw new Error('Please provide a TokenSet or use the Proxy server to Authenticate once');
        }
        if (!resourceUrl.startsWith('http')) {
            resourceUrl = 'https://api.prod.unicloud.edc.dknadmin.be' + resourceUrl;
        }
        options = options || {};
        options.timeout = this.options.communicationTimeout;
        options.headers = options.headers || {};
        options.headers['user-agent'] = 'Daikin/1.6.1.4681 CFNetwork/1209 Darwin/20.2.0';
        options.headers['x-api-key'] = 'xw6gvOtBHq5b1pyceadRp6rujSNSZdjx2AqT03iC';
        const res = await this.openIdClient.requestResource(resourceUrl, this.tokenSet, options);
        if (res.statusCode === 200) {
            try {
                return JSON.parse(res.body.toString());
            } catch {
                return res.body.toString();
            }
        }
        if (res.statusCode === 204) {
            return true;
        }
        if (!refreshed && res.statusCode === 401) { // Refresh needed
            await this.refreshAccessToken();
            return this.doBearerRequest(resourceUrl, options,true);
        }
        const err = new Error('Communication failed ' + res.statusCode);
        err.response = res;
        throw err;
    }

    /**
     * Get Tokens
     * @returns {TokenSet} Tokens
     */
    getTokenSet() {
        return this.tokenSet;
    }

    /**
     * Get Daikin API Info
     * @returns {Promise<Object>} API Info object
     */
    async getApiInfo() {
        return this.doBearerRequest('/v1/info');
    }

    /**
     * Get pure Device Data from the Daikin cloud devices
     * @returns {Promise<Object>} pure Device details
     */
    async getCloudDeviceDetails() {
        return this.doBearerRequest('/v1/gateway-devices');
    }

    /**
     * Get array of DaikinCloudDevice objects to interact with the device and get data
     *
     * @returns {Promise<Array[DaikinCloudDevice]>}
     */
    async getCloudDevices() {
        const devices = await this.getCloudDeviceDetails();
        const res = [];
        devices.forEach(dev => res.push(new DaikinCloudDevice(dev, this)));
        return res;
    }

    /**
     * Returns the Tokens using mail authentication
     * @emits DaikinCloudController#token_update
     * @param {string} userName Mail address oassociated with the account
     * @param {string} password Password of the account
     * @returns {Promise<any>} Instance of openid-client.TokenSet with tokens
     * @public
     */
     async login(userName, password) {
        Proxy = Proxy || require('./lib/proxy');

        // Initiate dummyproxy without starting it
        const dummyProxy = new Proxy(this.openIdClient, {
            logLevel: this.options.logLevel,
            logger: this.options.logger
        });

        let cookies;
        let location;
        let login_token;

        // Extract csrf state cookies
        let csrfStateCookie;
        try {
            const response = await got(dummyProxy._generateInitialUrl(), {
                followRedirect: false,
                timeout: {
                    response: this.options.communicationTimeout,
                    request: this.options.communicationTimeout
                },
                retry: {
                    retries: this.options.communicationRetries,
                    errorCodes: ['ETIMEDOUT'],
                    methods: ['GET', 'POST']
                }
            });

            let cookies = response.headers['set-cookie'];
            csrfStateCookie = cookies[1].split(';')[0].trim() + '; '
                + cookies[2].split(';')[0].trim();
            location = response.headers['location'];
        } catch (err) {
            err.message = 'Error trying to reach initial URL: ' + err.message;
            throw err;
        }

        // Extract SAML Context
        let samlContext;

        try {
            const response = await got(location, {
                followRedirect: false,
                timeout: {
                    response: this.options.communicationTimeout,
                    request: this.options.communicationTimeout
                },
                retry: {
                    retries: this.options.communicationRetries,
                    errorCodes: ['ETIMEDOUT'],
                    methods: ['GET', 'POST']
                }
            })
            location = response.headers['location'];

            let regex = /samlContext=([^&]+)/g;
            let match = regex.exec(location);
            samlContext = match[1];
        } catch (err) {
            err.message = 'Error trying to follow redirect: ' + err.message;
            throw err;
        }

        // Extract API version
        let version;

        try {
            const body = await got('https://cdns.gigya.com/js/gigya.js', {
                searchParams: { 'apiKey': '3_xRB3jaQ62bVjqXU1omaEsPDVYC0Twi1zfq1zHPu_5HFT0zWkDvZJS97Yw1loJnTm' },
                timeout: {
                    response: this.options.communicationTimeout,
                    request: this.options.communicationTimeout
                },
                retry: {
                    retries: this.options.communicationRetries,
                    errorCodes: ['ETIMEDOUT'],
                    methods: ['GET', 'POST']
                }
            }).text();
            let regex = /"(\d+-\d-\d+)"/g
            let match = regex.exec(body);
            version = match[1];
        } catch (err) {
            err.message = 'Error trying to extract API version: ' + err.message;
            throw err;
        }

        // Extract the cookies used for the Single Sign On
        let ssoCookies;
        try {
            const response = await got('https://cdc.daikin.eu/accounts.webSdkBootstrap', {
                searchParams: {
                    'apiKey': '3_xRB3jaQ62bVjqXU1omaEsPDVYC0Twi1zfq1zHPu_5HFT0zWkDvZJS97Yw1loJnTm',
                    'sdk': 'js_latest',
                    'format': 'json'
                },
                timeout: {
                    response: this.options.communicationTimeout,
                    request: this.options.communicationTimeout
                },
                retry: {
                    retries: this.options.communicationRetries,
                    errorCodes: ['ETIMEDOUT'],
                    methods: ['GET', 'POST']
                }
            });
            ssoCookies = response.headers['set-cookie'];
        } catch (err) {
            err.message = 'Error trying to extract SSO cookies: ' + err.message;
            throw err;
        }

        // Login
        cookies = ssoCookies[0].split(';')[0].trim() + '; '
            + ssoCookies[2].split(';')[0].trim() + '; '
            + 'hasGmid=ver4; '
            + 'gig_bootstrap_3_xRB3jaQ62bVjqXU1omaEsPDVYC0Twi1zfq1zHPu_5HFT0zWkDvZJS97Yw1loJnTm=cdc_ver4; '
            + 'gig_canary_3_QebFXhxEWDc8JhJdBWmvUd1e0AaWJCISbqe4QIHrk_KzNVJFJ4xsJ2UZbl8OIIFY=false; '
            + 'gig_canary_ver_3_QebFXhxEWDc8JhJdBWmvUd1e0AaWJCISbqe4QIHrk_KzNVJFJ4xsJ2UZbl8OIIFY=' + version + '; '
            + 'apiDomain_3_QebFXhxEWDc8JhJdBWmvUd1e0AaWJCISbqe4QIHrk_KzNVJFJ4xsJ2UZbl8OIIFY=cdc.daikin.eu; ';

        try {
            const json = await got('https://cdc.daikin.eu/accounts.login', {
                'headers': {
                    'content-type': 'application/x-www-form-urlencoded',
                    'cookie': cookies
                },
                searchParams: {
                    'loginID': userName,
                    'password': password,
                    'sessionExpiration':'31536000',
                    'targetEnv':'jssdk',
                    'include': 'profile,',
                    'loginMode': 'standard',
                    'riskContext': '{"b0":7527,"b2":4,"b5":1',
                    'APIKey': '3_xRB3jaQ62bVjqXU1omaEsPDVYC0Twi1zfq1zHPu_5HFT0zWkDvZJS97Yw1loJnTm',
                    'sdk': 'js_latest',
                    'authMode': 'cookie',
                    'pageURL': 'https://my.daikin.eu/content/daikinid-cdc-saml/en/login.html?samlContext=' + samlContext,
                    'sdkBuild': '12208',
                    'format': 'json'
                },
                'method': 'POST',
                timeout: {
                    response: this.options.communicationTimeout,
                    request: this.options.communicationTimeout
                },
                retry: {
                    retries: this.options.communicationRetries,
                    errorCodes: ['ETIMEDOUT'],
                    methods: ['GET', 'POST']
                }
            }).json();

            if (json && json.errorCode === 0 && json.sessionInfo && json.sessionInfo.login_token) {
                login_token = json.sessionInfo.login_token;
            } else {
                throw new Error(json.errorDetails || `Unknown Login error: ${JSON.stringify(json)}`);
            }
        } catch (err) {
            err.message = 'Login failed: ' + err.message;
            throw err;
        }

        let samlResponse;
        let relayState;
        cookies = cookies +
            + 'glt_3_xRB3jaQ62bVjqXU1omaEsPDVYC0Twi1zfq1zHPu_5HFT0zWkDvZJS97Yw1loJnTm=' + login_token + '; '
            + 'gig_loginToken_3_QebFXhxEWDc8JhJdBWmvUd1e0AaWJCISbqe4QIHrk_KzNVJFJ4xsJ2UZbl8OIIFY=' + login_token + '; '
            + 'gig_loginToken_3_QebFXhxEWDc8JhJdBWmvUd1e0AaWJCISbqe4QIHrk_KzNVJFJ4xsJ2UZbl8OIIFY_exp=' + (Date.now() + 3600000) + '; '
            + 'gig_loginToken_3_QebFXhxEWDc8JhJdBWmvUd1e0AaWJCISbqe4QIHrk_KzNVJFJ4xsJ2UZbl8OIIFY_visited=%2C3_xRB3jaQ62bVjqXU1omaEsPDVYC0Twi1zfq1zHPu_5HFT0zWkDvZJS97Yw1loJnTm;';

        try {
            const body = await got('https://cdc.daikin.eu/saml/v2.0/3_xRB3jaQ62bVjqXU1omaEsPDVYC0Twi1zfq1zHPu_5HFT0zWkDvZJS97Yw1loJnTm/idp/sso/continue', {
                searchParams: {
                    'samlContext': samlContext,
                    'loginToken': login_token},
                headers: {
                    'cookie': cookies
                },
                timeout: {
                    response: this.options.communicationTimeout,
                    request: this.options.communicationTimeout
                },
                retry: {
                    retries: this.options.communicationRetries,
                    errorCodes: ['ETIMEDOUT'],
                    methods: ['GET', 'POST']
                }
            }).text();

            let regex = /value="([^"]+=*)"/g;
            let matches = regex.exec(body);
            samlResponse = matches[1];
            matches = regex.exec(body);
            relayState = matches[1];
        } catch (err) {
            err.message = 'Authentication on SAML Identity Provider failed: ' + err.message;
            throw err;
        }

        // Fetch the daikinunified URL
        let daikinunified;
        const params = new URLSearchParams({
            'SAMLResponse': samlResponse,
            'RelayState': relayState
        });

        try {
            const response = await got.post('https://daikin-unicloud-prod.auth.eu-west-1.amazoncognito.com/saml2/idpresponse', {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'cookie': csrfStateCookie
                },
                body: params.toString(),
                followRedirect: false,
                timeout: {
                    response: this.options.communicationTimeout,
                    request: this.options.communicationTimeout
                },
                retry: {
                    retries: this.options.communicationRetries,
                    errorCodes: ['ETIMEDOUT'],
                    methods: ['GET', 'POST']
                }
            });
            daikinunified = response.headers['location'];

            if (!daikinunified.startsWith('daikinunified://')) {
                throw new Error(`Invalid final Authentication redirect. Location is ${daikinunified}`);
            }
        } catch (err) {
            err.message = 'Impossible to retrieve SAML Identity Provider\'s response: ' + err.message;
            throw err;
        }

        this.tokenSet = await dummyProxy._retrieveTokens(daikinunified);

        /**
         * Inform the using application about changed Tokens (in this case it are new received tokens)
         * to store on application side
         *
         * @event DaikinCloudController#token_update
         * @property {TokenSet} Instance of openid-client-TokenSet with updated tokens
         **/

         this.emit('token_update', this.tokenSet);
         return this.tokenSet;
    }
}

module.exports = DaikinCloudController;
