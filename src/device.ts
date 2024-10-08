import type { OnectaClient } from './onecta/oidc-client.js';
import { EventEmitter } from "events";

interface DaikinCloudDeviceEvents {
    "updated": [];
}

type SetDataOptions = {
    /**
     * If true, the writable check "settable" will be ignored.
     * @default false
     */
    ignoreWritableCheck?: boolean;
    /**
     * If true, the local Device data will be updated without waiting for a new cloud update
     * @default false
     */
    updateLocalData?: boolean
}

/**
 * Class to represent and control one Daikin Cloud Device
 */
export class DaikinCloudDevice extends EventEmitter<DaikinCloudDeviceEvents> {
    #client: OnectaClient;
    desc: any;
    managementPoints: Record<string, any>;

    /**
     * Constructor, called from DaikinCloud class when initializing all devices
     *
     * @param deviceDescription object with device description from Cloud request
     * @param client Instance of DaikinCloud used for communication
     */
    constructor(deviceDescription: any, client: OnectaClient) {
        super();
        this.managementPoints = {};
        this.#client = client;
        this.setDescription(deviceDescription);
    }

    /**
     * Helper method to traverse the Device object returned by Daikin cloud for subPath datapoints
     *
     * @param obj Object to traverse
     * @param data Data object where all data are collected
     * @param [pathPrefix] remember the path when traversing through structure
     * @returns collected data
     * @private
     */
    #traverseDatapointStructure(obj: any, data?: any, pathPrefix?: string) {
        if (obj === null) return;
        data = data || {};
        pathPrefix = pathPrefix || '';

        //console.log('ENTER: ' + pathPrefix);
        Object.keys(obj).forEach(sub => {
            if (!sub || !obj[sub]) return;
            const subKeys = Object.keys(obj[sub]);
            if (sub === 'meta' || subKeys.includes('value') || subKeys.includes('settable') || subKeys.includes('unit')) { // we found end leaf
                //console.log('FINAL ' + pathPrefix + '/' + sub);
                data[pathPrefix + '/' + sub] = obj[sub];
            } else if (sub ==="electrical" && pathPrefix === '' && typeof obj[sub] === 'object' && obj[sub] !== null) { // hack for missing "unit" field in electical on Altherma devices
                obj[sub].unit = 'kWh';
                data[pathPrefix + '/' + sub] = obj[sub];
            } else if (typeof obj[sub] === 'object' && obj[sub] !== null) { // go one level deeper
                //console.log('   found ' + sub);
                this.#traverseDatapointStructure(obj[sub], data, pathPrefix + '/' + sub);
            } else {
                //console.log('HHHMMM ' + sub);
            }
        });
        return data;
    }

    /**
     * Set a device description and parse/traverse data structure
     *
     * @param desc Device Description
     */
    setDescription(desc: any) {
        this.desc = desc;

        // re-map some data for more easy access
        this.managementPoints = {};
        this.desc.managementPoints.forEach((mp: any) => {
            const dataPoints: any = {};
            Object.keys(mp).forEach((key) => {
                if (!mp[key] || typeof mp[key] !== 'object') return; // we ignore non dataPoints

                if (typeof mp[key].value !== 'object' || (Object.keys(mp[key].value).length === 1 && mp[key].value.hasOwnProperty('enabled'))) { // normal datatype like string or number
                    dataPoints[key] = mp[key]; // we simply take of the datapoint
                } else { // data goes deeper in structure
                    dataPoints[key] = this.#traverseDatapointStructure(mp[key].value);
                    //console.log('RES-KEY ' + mp.embeddedId + ' - ' + key + ': ' + JSON.stringify(dataPoints[key]));
                }
            });

            this.managementPoints[mp.embeddedId] = dataPoints;
        });
        //console.log('RES: ' + JSON.stringify(this.managementPoints));
        this.emit('updated');
    }

    /**
     * Get Daikin Device UUID
     * @returns Device Id (UUID)
     */
    getId(): string {
        return this.desc.id;
    }

    /**
     * Get the original Daikin Device Description
     *
     * @returns Daikin Device Description
     */
    getDescription() {
        return this.desc;
    }

    /**
     * Get the timestamp when data were last updated
     *
     * @returns {Date} Last updated timestamp
     */
    getLastUpdated() {
        return new Date(this.desc.lastUpdateReceived || this.desc.timestamp);
    }

    /**
     * Get the info if device is connected to cloud
     *
     * @returns {boolean} Connected status
     */
    isCloudConnectionUp() {
        return !!this.desc.isCloudConnectionUp.value;
    }

    /**
     * Get a current data object (includes value and meta information).
     * Without any parameter the full internal data structure is returned and
     * can be further detailed by sending parameters
     *
     * @param {string} [managementPoint] Management point name
     * @param {string} [dataPoint] Datapoint name for management point
     * @param {string} [dataPointPath] further detailed datapoints with subpath data
     * @returns {object|null} Data object
     */
    getData(managementPoint: any, dataPoint: any, dataPointPath: any) {
        if (!managementPoint) { // return all data
            return this.managementPoints;
        }

        if (!this.managementPoints[managementPoint]) {
            return null;
        }
        if (!dataPoint) { // return data from one managementPoint
            return this.managementPoints[managementPoint];
        }

        if (!this.managementPoints[managementPoint][dataPoint]) {
            return null;
        }
        if (!dataPointPath) { // return data from one managementPoint and dataPoint
            return this.managementPoints[managementPoint][dataPoint];
        }
        if (!this.managementPoints[managementPoint][dataPoint][dataPointPath]) {
            return null;
        }

        // return data for managementPoint and dataPoint and dataPointPath
        return this.managementPoints[managementPoint][dataPoint][dataPointPath];
    }

    /**
     * Update the data of this device from the cloud
     *
     * @returns {Promise<boolean>}
     */
    async updateData() {
        // TODO: Enhance this method to also allow to get some partial data like only one managementPoint or such; needs checking how to request
        const desc = await this.#client.requestResource('/v1/gateway-devices/' + this.getId());
        this.setDescription(desc);
        return true;
    }

    /**
     * Validates a value that should be sent to the Daikin Device
     *
     * @param {object} def  Datapoint definition/meta data to verify
     * @param {any} value Value to be set
     * @param {boolean} [ignoreWritableCheck=false] Ignore the writable check
     * @throws Error
     * @private
     */
    #validateData(def: any, value: any, ignoreWritableCheck = false) {
        if (!def.hasOwnProperty('value') && !def.hasOwnProperty('settable')) {
            throw new Error('Value can not be set without dataPointPath');
        }

        if (!ignoreWritableCheck && (!def.hasOwnProperty('settable') || !def.settable)) {
            throw new Error('Value is not writable');
        }
        if (def.hasOwnProperty('value') && typeof def.value !== typeof value) {
            throw new Error('Type of value (' + typeof value + ') is not the expected type ' + typeof def.value);
        }

        if (Array.isArray(def.values) && !def.values.includes(value)) {
            throw new Error('Value (' + value + ') is not in the list of allowed values ' + def.values.join(','));
        }

        if (typeof def.maxLength === 'number' && typeof value === 'string' && value.length > def.maxLength) {
            throw new Error('Length of value (' + value.length + ') is longer then the allowed ' + def.maxLength + ' characters');
        }

        if (typeof def.minValue === 'number' && typeof value === 'number' && value < def.minValue) {
            throw new Error('Value (' + value + ') must not be smaller then ' + def.minValue);
        }

        if (typeof def.maxValue === 'number' && typeof value === 'number' && value > def.maxValue) {
            throw new Error('Value (' + value + ') must not be bigger then ' + def.maxValue);
        }

        // TODO add more validations for stepValue(number)
    }

    /**
     * Set a datapoint on this device
     *
     * @param {string} managementPoint Management point name
     * @param {string} dataPoint Datapoint name for management point
     * @param {string} [dataPointPath] further detailed datapoints with subpath data, if needed
     * @param {number|string} value Value to set
     * @param {SetDataOptions|boolean} options Options object for setData
     * @returns {Promise<Object|boolean>} should return a true - or if a body is returned teh body object (can this happen?)
     */
    async setData(managementPoint: any, dataPoint: any, dataPointPath: any, value: any, options: SetDataOptions | boolean = { ignoreWritableCheck: false, updateLocalData: false }) {
        if (typeof options === 'boolean') {
            console.warn('ignoreWritableCheck is deprecated and replaced with an options object. Please provide a SetDataOptions object for setData()');
            options = {
                ignoreWritableCheck: options,
                updateLocalData: false
            }
        }

        if (value === undefined) {
            value = dataPointPath;
            dataPointPath = undefined;
        }

        if (!this.managementPoints[managementPoint] || !this.managementPoints[managementPoint][dataPoint] || (dataPointPath && !this.managementPoints[managementPoint][dataPoint][dataPointPath])) {
            throw new Error('Please provide a valid datapoint definition that exists in the data structure');
        }

        const dataPointDef = dataPointPath ? this.managementPoints[managementPoint][dataPoint][dataPointPath] : this.managementPoints[managementPoint][dataPoint];
        this.#validateData(dataPointDef, value, options.ignoreWritableCheck);

        const setPath =  '/v1/gateway-devices/' + this.getId() + '/management-points/' + managementPoint + '/characteristics/' + dataPoint;
        const setBody = {
            value,
            path: dataPointPath
        };
        const setOptions = {
            method: 'PATCH',
            body: JSON.stringify(setBody),
            headers: {
                'Content-Type': 'application/json'
            }
        } as const;

        const response = this.#client.requestResource(setPath, setOptions);
        if (options.updateLocalData) {
            dataPointDef.value = value;
        }
        return response;
    }
}
