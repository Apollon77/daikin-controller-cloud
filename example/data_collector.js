/**
 * Example Script to use the Daikin-Controller-Cloud library
 *
 * This example will use Username/Password from environment variable
 * DAIKIN_USERNAME and DAIKIN_PASSWORD and outputs data out to data.json
 * 
 * DAIKIN_USERNAME='x' DAIKIN_PASSWORD='y' node data_collector.js
 */

const DaikinCloud = require('../index');
const fs = require('fs');
const path = require('path');


async function main() {
    const daikinCloud = await initDaikinCloud();

    console.log("fetching data ...")
    const daikinDeviceDetails = await daikinCloud.getCloudDeviceDetails();
    // console.log(`Cloud Device Details: ${JSON.stringify(daikinDeviceDetails)}`);
    // console.log(JSON.stringify(daikinDeviceDetails));

    const file = process.env.OUTPUT_FILE || 'data.json'
    fs.writeFileSync(file, JSON.stringify(daikinDeviceDetails));

    async function initDaikinCloud() {
        let tokenSet;

        // Load Tokens if they already exist on disk
        const tokenFile = path.join(__dirname, 'tokenset.json');
        if (fs.existsSync(tokenFile)) {
            tokenSet = JSON.parse(fs.readFileSync(tokenFile).toString());
        }

        // Initialize Daikin Cloud Instance
        const daikinCloud = new DaikinCloud(tokenSet);

        // Event that will be triggered on new or updated tokens, save into file
        daikinCloud.on('token_update', tokenSet => {
            console.log(`UPDATED tokens, use for future and wrote to tokenset.json`);
            fs.writeFileSync(tokenFile, JSON.stringify(tokenSet));
        });

        const { username, password } = retrieveCredentials();
        if (!fs.existsSync(tokenFile)) {
            console.log("logging into ...");
            await daikinCloud.login(username, password);
        }
        return daikinCloud;
    }

    function retrieveCredentials() {
        const username = process.env.DAIKIN_USERNAME;
        if (username == undefined) {
            throw new Error("WARN please provide username as env variable 'DAIKIN_USERNAME'");
        }

        const password = process.env.DAIKIN_PASSWORD;
        if (password == undefined) {
            throw new Error("WARN please provide password as env variable 'DAIKIN_PASSWORD'");
        }
        return { username, password };
    }
}

(async () => {
    await main();
})();

