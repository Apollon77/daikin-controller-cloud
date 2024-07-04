import { EventEmitter } from 'events';
import { DaikinCloudDevice } from './device.js';
import { OnectaClient } from './onecta/oidc-client.js';
import { OnectaClientConfig, OnectaRateLimitStatus } from './onecta/oidc-utils.js';
import { TokenSet } from "openid-client";

interface DaikinCloudControllerEvents {
    "error": [err: Error];
    "authorization_request": [url: string];
    "token_update": [tokenSet: TokenSet];
    "rate_limit": [OnectaRateLimitStatus];
}

/**
 * Daikin Controller for Cloud solution to get tokens and interact with devices
 */
export class DaikinCloudController extends EventEmitter<DaikinCloudControllerEvents> {
    #client: OnectaClient;
    #devices = new Map<string, DaikinCloudDevice>();

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
        await this.updateAllDeviceData();
        return Array.from(this.#devices.values());
    }

    async updateAllDeviceData() {
        const data = await this.getCloudDeviceDetails();
        data.forEach(d => {
            const device = this.#devices.get(d.id);
            if (device) {
                device.setDescription(d);
            } else {
                const newDevice = new DaikinCloudDevice(d, this.#client);
                this.#devices.set(newDevice.getId(), newDevice);
            }
        });
    }
}
