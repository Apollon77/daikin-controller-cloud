
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { OnectaClientConfig } from './oidc-utils.js';

import { resolve } from 'node:path';
import { createServer, Server } from 'node:https';
import { readFile } from 'node:fs/promises';


export type OnectaOIDCCallbackServerRequestListener<
  Request extends typeof IncomingMessage = typeof IncomingMessage,
  Response extends typeof ServerResponse = typeof ServerResponse,
> = (server: Server, req: InstanceType<Request>, res: InstanceType<Response> & { req: InstanceType<Request> }) => void;

/**
 * Creates and starts a HTTPS server
 */
export const startOnectaOIDCCallbackServer = async (config: OnectaClientConfig, listener: OnectaOIDCCallbackServerRequestListener): Promise<void> => {
  const server = createServer({
    key: await readFile(resolve(__dirname, '..', '..', 'cert', 'cert.key')),
    cert: await readFile(resolve(__dirname, '..', '..', 'cert', 'cert.pem')),
  });
  await new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      server.removeListener('listening', onListening);
      server.removeListener('error', onError);
    };
    const onListening = () => {
      cleanup();
      resolve();
    }
    const onError = (err: Error) => {
      cleanup();
      reject(err);
    };
    server.on('listening', onListening);
    server.on('error', onError);
    server.listen(config.oidc_callback_server_port, config.oidc_callback_server_addr);
  });
  await new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      server.removeListener('request', listener);
      server.removeListener('error', onError);
      server.removeListener('close', onClose);
    };
    const onError = (err: Error) => {
      cleanup();
      reject(err);
    };
    const onClose = () => {
      cleanup();
      resolve();
    };
    server.on('close', resolve);
    server.on('request', (req, res) => listener(server, req, res));
    server.on('error', onError);
  });
};
