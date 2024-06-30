
import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { DaikinCloudController } from './index';

const {
  oidc_client_id,
  oidc_client_secret,
} = process.env;

if (!oidc_client_id || !oidc_client_secret) {
  console.log('Please set the oidc_client_id and oidc_client_secret environment variables');
  process.exit(0);
}

const controller = new DaikinCloudController({
  oidc_client_id,
  oidc_client_secret,
  oidc_callback_server_addr: '127.0.0.1',
  oidc_callback_server_port: 8765,
  // This URL must be set as the application's callback URL within
  // Daikin's developer console at https://developer.cloud.daikineurope.com
  oidc_callback_server_baseurl: 'https://daikin.local:8765',
  oidc_tokenset_file_path: resolve(homedir(), '.daikin-controller-cloud-tokenset'),
});

controller.on('authorization_request', (url) => {
  console.log('Please navigate to %s', url);
});

(async () => {

  const devices = await controller.getCloudDeviceDetails();
  console.log(devices);

})().catch(console.error);

