/**
 * Example Script to use the Daikin-Controller-Cloud library
 *
 * This example will open a Proxy Server or use Username/Password
 * login if data are provided when no tokens are provided to allow
 * a Login with the Daikin Cloud to get the needed tokens.
 *
 * The tokens will be stored in a tokenset.json file in the example
 * directory and this file is also loaded on startup.
 *
 * When tokens exist (or were successfully retrieved) the device list
 * is requested from the cloud account and shown as json.
 */

const DaikinCloud = require('../index');
const fs = require('fs');


async function main() {
    const daikinCloud = await initDaikinCloud();

    console.log("fetching data ...")
    const daikinDeviceDetails = await daikinCloud.getCloudDeviceDetails();
    // console.log(`Cloud Device Details: ${JSON.stringify(daikinDeviceDetails)}`);
    // console.log(JSON.stringify(daikinDeviceDetails));

    fs.writeFileSync('/dev/stderr', JSON.stringify(daikinDeviceDetails));

    async function initDaikinCloud() {
        /**
         * Options to initialize the DaikinCloud instance with
         */
        const options = {
            logger: console.log,          // optional, logger function used to log details depending on loglevel
            logLevel: 'info',             // optional, Loglevel of Library, default 'warn' (logs nothing by default)
            proxyOwnIp: '127.0.0.1',      // required, if proxy needed: provide own IP or hostname to later access the proxy
            proxyPort: 8888,              // required: use this port for the proxy and point your client device to this port
            proxyWebPort: 8889,           // required: use this port for the proxy web interface to get the certificate and start Link for login
            proxyListenBind: '127.0.0.1', // optional: set this to bind the proxy to a special IP, default is '0.0.0.0'
            proxyDataDir: process.cwd()   // Directory to store certificates and other proxy relevant data to
        };
        const daikinCloud = new DaikinCloud({}, options);
        const { username, password } = retrieveCredentials();
        console.log("logging into ...");
        await daikinCloud.login(username, password);
        return daikinCloud;
    }

    function retrieveCredentials() {
        const username = process.env.DAIKIN_USERNAME;
        const password = process.env.DAIKIN_PASSWORD;

        if (username == undefined) {
            throw new Error("WARN please provide username as env variable 'DAIKIN_USERNAME'");
        }
        if (password == undefined) {
            throw new Error("WARN please provide password as env variable 'DAIKIN_PASSWORD'");
        }
        return { username, password };
    }
}

(async () => {
    await main(); process.exit();
})();

