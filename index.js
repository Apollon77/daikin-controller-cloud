const EventEmitter = require('events');

const DaikinCloudDevice = require('./lib/device');

/**
 * Daikin Controller for Cloud solution to get tokens and interact with devices
 */
class DaikinCloudController extends EventEmitter {
    /**
     * Constructor for Daikin Cloud Controller
     * @param {string} clientId Client ID from your ONECTA Cloud API application
     * @param {string} clientSecret Client Secret from your ONECTA Cloud API application
     * @param {TokenSet} tokenSet JSON TokenSet with the already known communication tokens
     */
    constructor(clientId, clientSecret, tokenSet) {
        super();
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.tokenSet = tokenSet;
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
        try {
            const queryParameters = new URLSearchParams();
            queryParameters.set('grant_type', 'refresh_token');
            queryParameters.set('client_id', this.clientId);
            queryParameters.set('client_secret', this.clientSecret);
            queryParameters.set('refresh_token', this.tokenSet.refresh_token);
            const response = await fetch(`https://idp.onecta.daikineurope.com/v1/oidc/token?${queryParameters.toString()}`, {
                method: 'POST',
            });

            if (response.status !== 200) {
                throw new Error(`Token call failed with status ${response.status}, reason: ${JSON.stringify(await response.json(), null, 4)}`);
            }

            this.tokenSet = await response.json();
            this.emit('token_update', this.tokenSet);
            return this.tokenSet;
        } catch (e) {
            throw new Error('Token refresh failed: ' + e.message);
        }
    }

    /**
     * Do a Bearer token authenticated request against Daikin cloud
     * with auto token refresh if needed
     *
     * On Error the got response is included as property "response"  in Error object
     *
     * @param {string} resourceUrl URL to access
     * @param {object} [extraOptions] Call options
     * @param {boolean} [refreshed] internal flag if the call is a second try after token refresh
     * @returns {Promise<object>} Data returned by daikin cloud
     */
    async doBearerRequest(resourceUrl, extraOptions, refreshed) {
        if (!this.tokenSet) {
            throw new Error('Please provide a TokenSet to authenticate');
        }

        if (!resourceUrl.startsWith('http')) {
            resourceUrl = 'https://api.onecta.daikineurope.com' + resourceUrl;
        }

        const options = {
            headers: {
                'Authorization': 'Bearer ' + this.tokenSet.access_token,
                'Content-Type': 'application/json'
            },
            ...extraOptions
        }

        const fetchResponse = await fetch(resourceUrl, options);

        this.printRateLimitStatus(fetchResponse.headers);

        if (fetchResponse.status === 204) {
            return true;
        }
        if (fetchResponse.status === 200) {
            return await fetchResponse.json();
        }
        if (!refreshed && fetchResponse.status === 401) { // Refresh needed
            await this.refreshAccessToken();
            return this.doBearerRequest(resourceUrl, extraOptions,true);
        }

        const err = new Error(`Call to ONECTA Cloud API failed with status [${fetchResponse.status}], response: ${JSON.stringify(await fetchResponse.json(), null, 4)}`);
        err.response = await fetchResponse.json();
        throw err;
    }

    printRateLimitStatus(headers) {
        console.debug(`Rate Limit: calls left today: ${headers.get('X-RateLimit-Remaining-day')}/${headers.get('X-RateLimit-Limit-day')}`);
        console.debug(`Rate Limit: calls left this minute: ${headers.get('X-RateLimit-Remaining-minute')}/${headers.get('X-RateLimit-Limit-minute')}, resets in ${headers.get('RateLimit-Reset')} seconds`);
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
     * Trade Authenticated Tokens for a new Access Token
     *
     * @returns {Promise<TokenSet>}
     */
    static async getAccessTokenFromAuthToken(authToken) {
        try {
            const queryParameters = new URLSearchParams();
            queryParameters.set('grant_type', 'authorization_code');
            queryParameters.set('client_id', this.clientId);
            queryParameters.set('client_secret', this.clientSecret);
            queryParameters.set('code', authToken);
            const response = await fetch(`https://idp.onecta.daikineurope.com/v1/oidc/token?${queryParameters.toString()}`, {
                method: 'POST',
            });

            if (response.status !== 200) {
                throw new Error(`Token call failed with status ${response.status}, reason: ${JSON.stringify(await response.json(), null, 4)}`);
            }

            this.tokenSet = await response.json();
            return this.tokenSet;
        } catch (e) {
            throw new Error('Trade Auth Token for Access Token failed: ' + e.message);
        }
    }


}

module.exports = DaikinCloudController;
