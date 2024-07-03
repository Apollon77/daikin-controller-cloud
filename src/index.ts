import { EventEmitter } from 'events';
import { DaikinCloudDevice } from './device.js';
import { OnectaClient } from './onecta/oidc-client.js';
import { OnectaClientConfig } from './onecta/oidc-utils.js';
import { TokenSet } from "openid-client";

interface DaikinCloudControllerEvents {
    "error": [err: Error];
    "authorization_request": [url: string];
    "token_update": [tokenSet: TokenSet];
}

/**
 * Daikin Controller for Cloud solution to get tokens and interact with devices
 */
export class DaikinCloudController extends EventEmitter<DaikinCloudControllerEvents> {
    #client: OnectaClient;

    constructor(config: OnectaClientConfig) {
        super();
        this.#client = new OnectaClient(config, this);
    }

    /**
     * Get Daikin API Info
     * @returns {Promise<Object>} API Info object
     */
    async getApiInfo() {
        return this.#client.requestResource('/v1/info');
    }

    /**
     * Get pure Device Data from the Daikin cloud devices
     * @returns {Promise<Object>} pure Device details
     */
    async getCloudDeviceDetails(): Promise<any[]> {
        return await this.#client.requestResource('/v1/gateway-devices');
    }

    /**
     * Get array of DaikinCloudDevice objects to interact with the device and get data
     */
    async getCloudDevices(): Promise<DaikinCloudDevice[]> {
        const devices = await this.getCloudDeviceDetails();
        return devices.map(dev => new DaikinCloudDevice(dev, this.#client));
    }
}
