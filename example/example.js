/**
 * Example Script to use the Daikin-Controller-Cloud library
 *
 * This example will open a Proxy Server when no tokens are provided
 * to allow a Login with the Daikin Cloud to get the needed tokens.
 *
 * For an example on how to use the automatic Username/Password Login
 * please refer to tokensaver.js
 *
 * The tokens will be stored in a tokenset.json file in the example
 * directory and this file is also loaded on startup.
 *
 * When tokens exist (or were successfully retrieved) the device list
 * is requested from the cloud account and shown as json.
 */

const DaikinCloud = require('../index');
const fs = require('fs');
const path = require('path');

async function main() {
    let tokenSet;

    // Load Tokens if they already exist on disk
    const tokenFile = path.join(__dirname, 'tokenset.json');
    if (fs.existsSync(tokenFile)) {
        tokenSet = JSON.parse(fs.readFileSync(tokenFile).toString());
    }

    // Initialize Daikin Cloud Instance
    const daikinCloud = new DaikinCloud(process.env.ONECTA_CLIENT_ID, process.env.ONECTA_CLIENT_SECRET, tokenSet);

    // Event that will be triggered on new or updated tokens, save into file
    daikinCloud.on('token_update', tokenSet => {
        console.log(`UPDATED tokens, use for future and wrote to tokenset.json`);
        fs.writeFileSync(tokenFile, JSON.stringify(tokenSet));
    });

    const daikinDeviceDetails = await daikinCloud.getCloudDeviceDetails();
    console.log(`Cloud Device Details: ${JSON.stringify(daikinDeviceDetails)}`);

    const devices = await daikinCloud.getCloudDevices();

    if (devices && devices.length) {
        for (let dev of devices) {
            console.log('Device ' + dev.getId() + ' Data:');
            console.log('    last updated: ' + dev.getLastUpdated());
            console.log('    modelInfo: ' + dev.getData('gateway', 'modelInfo').value);
            console.log('    temp auto set room: ' + dev.getData('climateControl', 'temperatureControl', '/operationModes/auto/setpoints/roomTemperature').value);
            // console.log('    Full mapped description: ' + JSON.stringify(dev.getData()));

            // only partially tested, needs to be checked!!
            // await dev.setData('gateway', 'ledEnabled', true);
            // await dev.setData('climateControl', 'onOffMode', 'on');
            // await dev.setData('climateControl', 'temperatureControl', '/operationModes/auto/setpoints/roomTemperature', 20);
            await dev.updateData();
        }
    } else {
        console.log('No devices returned');
    }
}

(async () => {
    await main();
    process.exit();
})();
