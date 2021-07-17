/**
 * Example Script to use the Daikin-Controller-Cloud library
 *
 * This example will open a Proxy Server when no tokens are provided
 * to allow a Login with the Daikin Cloud to get the needed tokens.
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
         proxyOwnIp: '127.0.0.1',      // required, if proxy needed: provide own IP or hostname to later access the proxy
         proxyPort: 8888,              // required: use this port for the proxy and point your client device to this port
         proxyWebPort: 8889,           // required: use this port for the proxy web interface to get the certificate and start Link for login
         proxyListenBind: '0.0.0.0',   // optional: set this to bind the proxy to a special IP, default is '0.0.0.0'
         proxyDataDir: process.cwd()   // Directory to store certificates and other proxy relevant data to
     };
 
     let tokenSet;

    // Set outputfile for tokenset.json
    const tokenFile = path.join(process.cwd(), 'tokenset.json');
    options.logger('Writing tokenset to: ' + tokenFile);
     
 
    // Initialize Daikin Cloud Instance
    const daikinCloud = new DaikinCloud(tokenSet, options);
 
    // Event that will be triggered on new or updated tokens, save into file
    daikinCloud.on('token_update', tokenSet => {
        console.log(`UPDATED tokens, use for future and wrote to tokenset.json`);
        fs.writeFileSync(tokenFile, JSON.stringify(tokenSet));
    });
 
    let args = process.argv.slice(2);
    if (args.length == 2 && args[0].includes('@')) {
        const resultTokenSet = await daikinCloud.login(args[0], args[1]); 
        console.log('Retrieved tokens. Saved to ' + tokenFile);      
    } else {
        await daikinCloud.initProxyServer();
    
        console.log(`Please visit http://${options.proxyOwnIp}:${options.proxyWebPort} and Login to Daikin Cloud please.`);
        // wait for user Login and getting the tokens
        const resultTokenSet = await daikinCloud.waitForTokenFromProxy();
        console.log('Retrieved tokens. Saved to ' + tokenFile);
        //console.log(`Retrieved tokens, use for future: ${JSON.stringify(resultTokenSet)}`);
    
        // stop Proxy server (and wait 1s before we do that to make sure
        // the success page can be displayed correctly because waitForTokenFromProxy
        // will resolve before the last request is sent to the browser!
        await new Promise(resolve => setTimeout(resolve, 1000));
        await daikinCloud.stopProxyServer();
    }
    process.exit();
 }
 
 (async () => {
     await main();

 })();
 
