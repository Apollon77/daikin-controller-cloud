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
    /**
     * Options to initialize the DaikinCloud instance with
     */
    const options = {
        logger: console.log,          // optional, logger function used to log details depending on loglevel
        logLevel: 'info',             // optional, Loglevel of Library, default 'warn' (logs nothing by default)
        proxyOwnIp: '192.168.xxx.xxx',// required, if proxy needed: provide own IP or hostname to later access the proxy
        proxyPort: 8888,              // required: use this port for the proxy and point your client device to this port
        proxyWebPort: 8889,           // required: use this port for the proxy web interface to get the certificate and start Link for login
        proxyListenBind: '0.0.0.0',   // optional: set this to bind the proxy to a special IP, default is '0.0.0.0'
        proxyDataDir: __dirname,      // Directory to store certificates and other proxy relevant data to
        communicationTimeout: 10000,  // Amount of ms to wait for request and responses before timeout
        communicationRetries: 3       // Amount of retries when connection timed out
    };

    let tokenSet;

    // Load Tokens if they already exist on disk
    const tokenFile = path.join(__dirname, 'tokenset.json');
    if (fs.existsSync(tokenFile)) {
        tokenSet = JSON.parse(fs.readFileSync(tokenFile).toString());
    }

    // Initialize Daikin Cloud Instance
    const daikinCloud = new DaikinCloud(tokenSet, options);

    // Event that will be triggered on new or updated tokens, save into file
    daikinCloud.on('token_update', tokenSet => {
        console.log(`UPDATED tokens, use for future and wrote to tokenset.json`);
        fs.writeFileSync(tokenFile, JSON.stringify(tokenSet));
    });

    // If no tokens are existing start Proxy server process
    if (! tokenSet) {
        // start server
        await daikinCloud.initProxyServer();
        console.log(`Please visit http://${options.proxyOwnIp}:${options.proxyWebPort} and Login to Daikin Cloud please.`);
        console.log();

        // wait for user Login and getting the tokens
        const resultTokenSet = await daikinCloud.waitForTokenFromProxy();
        console.log(`Retrieved tokens, use for future: ${JSON.stringify(resultTokenSet)}`);

        // stop Proxy server (and wait 1s before we do that to make sure
        // the success page can be displayed correctly because waitForTokenFromProxy
        // will resolve before the last request is sent to the browser!
        await new Promise(resolve => setTimeout(resolve, 1000));
        await daikinCloud.stopProxyServer();
    }
    // show some details about the tokens (could be outdated because first real request is done afterwards
    console.log('Use Token with the following claims: ' + JSON.stringify(daikinCloud.getTokenSet().claims()));

    const daikinDeviceDetails = await daikinCloud.getCloudDeviceDetails();
    //console.log(`Cloud Device Details: ${JSON.stringify(daikinDeviceDetails)}`);

    const devices = await daikinCloud.getCloudDevices();

    if (devices && devices.length) {
        for (let dev of devices) {
            console.log('Device ' + dev.getId() + ' Data:');
            console.log('    last updated: ' + dev.getLastUpdated());
            console.log('    modelInfo: ' + dev.getData('gateway', 'modelInfo').value);
            console.log('    temp auto set room: ' + dev.getData('climateControl', 'temperatureControl', '/operationModes/auto/setpoints/roomTemperature').value);
            // console.log('    Full mapped description: ' + dev.getData());

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
