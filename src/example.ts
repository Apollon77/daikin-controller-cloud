
import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { DaikinCloudController } from './index';

// ============================================================================
// Read OIDC client credentials as environment variables.
// ============================================================================

const { oidc_client_id, oidc_client_secret } = process.env;
if (!oidc_client_id || !oidc_client_secret) {
  console.log('Please set the oidc_client_id and oidc_client_secret environment variables');
  process.exit(0);
}

// ============================================================================
// Create a new instance of the Onecta API client. Note that the
// `oidc_callback_server_baseurl` **must** be set as the application's
// "Redirect URI" within the Daikin Developer Portal.
// See https://developer.cloud.daikineurope.com .
// ============================================================================

const controller = new DaikinCloudController({
  /* OIDC client id */
  oidc_client_id,
  /* OIDC client secret */
  oidc_client_secret,
  /* network interface that the HTTP server should bind to */
  oidc_callback_server_addr: '0.0.0.0',
  /* port that the HTTP server should bind to */
  oidc_callback_server_port: 8765,
  /* OIDC Redirect URI */
  oidc_callback_server_baseurl: 'https://daikin.local:8765', // or use local IP address where server is reachable
  /* path of file used to cache the OIDC tokenset */
  oidc_tokenset_file_path: resolve(homedir(), '.daikin-controller-cloud-tokenset'),
  /* time to wait for the user to go through the authorization grant flow before giving up (in seconds) */
  oidc_authorization_timeout: 120,
  certificate_path: resolve(__dirname, '..', 'cert'),
});

// ============================================================================
// The client instance will emit the "authorization_request" event when user
// action is required to proceed with the flow that characterizes the OIDC
// Authorization grant. Applications using this library should prompt the user
// to open the provided URL in their browser of choice.
// ============================================================================

controller.on('authorization_request', (url) => {
  console.log(`
Please make sure that ${url} is set as "Redirect URL" in your Daikin Developer Portal account for the used Client!
 
Then please open the URL ${url} in your browser and accept the security warning for the self signed certificate (if you open this for the first time).
 
Afterwards you are redirected to Daikin to approve the access and then redirected back.`);
});

(async () => {

  // ==========================================================================
  // OIDC authentication, authorization and token management are all abstracted
  // away. The public methods exposed by the client map to the endpoints
  // provided by the Onecta API.
  // See https://developer.cloud.daikineurope.com/spec/b0dffcaa-7b51-428a-bdff-a7c8a64195c0/70b10aca-1b4c-470b-907d-56879784ea9c
  // ==========================================================================

  const devices = await controller.getCloudDeviceDetails();
  console.log(devices);

})().catch(console.error);

