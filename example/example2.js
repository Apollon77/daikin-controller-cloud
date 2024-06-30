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

async function main() {


    // Initialize Daikin Cloud Instance
    const tokenSet = await DaikinCloud.getAccessTokenFromAuthToken(process.env.ONECTA_CLIENT_ID, process.env.ONECTA_CLIENT_SECRET, 'st2.s.AtLt3aMM3A.KLKaNPx7URdh52bRi7yNw_xwhWVpVg0JjZqMBbbNfqiNqXS8v2i9hJVpfHTJO_v6CLky15-P6YBBCnn76JRMalyLFjxMZ_9ZrfR3m0Fgjn9UN6ZdxHtQsi9v9U_BokLq.NJ0Y0b8aXGS75CxAs0ZQeDPkUpp9wLd9PMCd7U1g0Lql05JZ6Wn4a4wcOM8UyjFPtB99Zkijy3fkUETmlr2S_w.sc3');

    console.log(tokenSet);
}

(async () => {
    await main();
    process.exit();
})();
