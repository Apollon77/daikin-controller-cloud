/**
 * Example Script to use the Daikin-Controller-Cloud library
 *
 * This example will use Username/Password from environment variable
 * DAIKIN_USERNAME and DAIKIN_PASSWORD and outputs data out to stderr
 * 
 * DAIKIN_USERNAME='x' DAIKIN_PASSWORD='y' node data_collector.js 2> data.json
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
        const daikinCloud = new DaikinCloud();
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
    await main();
})();

