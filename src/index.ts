// noinspection HttpUrlsUsage

import 'dotenv/config';
import configureDatabase from './bootstrap/database';
import configureExpress from './bootstrap/express';
import configureHttpServer from './bootstrap/http_server';
import configureWS from './bootstrap/ws';

(async () => {
  const startTime = performance.now();
  const app = configureExpress();
  const httpServer = configureHttpServer(app);
  configureWS(httpServer);
  await configureDatabase();

  httpServer.listen(8000, () => {
    const serverAddress = httpServer.address();
    let address: string;
    if (serverAddress == null) address = '127.0.0.1';
    else if (typeof serverAddress === 'string') address = serverAddress;
    else address = serverAddress.family === 'IPv6' ? `[${serverAddress.address}]` : serverAddress.address;
    console.info(`Listening on http://${address}:8000/`);
    console.log(`Started in ${(performance.now() - startTime).toFixed(2)}ms`);
  });
})();
