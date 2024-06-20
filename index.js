const EventEmitter = require('events');
const { Issuer, TokenSet, custom } = require('openid-client');

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

        // initialize OpenID Issuer with Daikin relevant details
        this.openIdIssuer = new Issuer({
            issuer: 'https://cdc.daikin.eu/oidc/op/v1.0/3_xRB3jaQ62bVjqXU1omaEsPDVYC0Twi1zfq1zHPu_5HFT0zWkDvZJS97Yw1loJnTm/',
            authorization_endpoint: 'https://idp.onecta.daikineurope.com/v1/oidc/authorize',
            token_endpoint: 'https://idp.onecta.daikineurope.com/v1/oidc/token',
        });

        // initialize OpenID Client with Daikin relevant details
        this.openIdClient = new this.openIdIssuer.Client({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            redirect_uris: ['http://somedomain.com/callback'],
            response_types: ['code'],
        });

        // enhance got client with additional logging for debug mode
        custom.setHttpOptionsDefaults({
            timeout: 10000,
        });
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
        await this.refreshAccessToken()
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

        const fetchResponse = await fetch(resourceUrl, options)

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


}

module.exports = DaikinCloudController;
