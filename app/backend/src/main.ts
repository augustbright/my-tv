/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import { getEnvVar } from 'server-utils';
import expressWs from 'express-ws';
import { apiRouter } from './api';
import cookieParser from 'cookie-parser';
import { verifySessionMiddleware } from './middleware/verify-session';
import { socketsService } from './service/sockets.service';

const port = getEnvVar('SERVICE_BACKEND_PORT');
const hostname = getEnvVar('SERVICE_BACKEND_HOSTNAME');
const globalPrefix = getEnvVar('SERVICE_BACKEND_GLOBAL_PREFIX');
const wsPrefix = getEnvVar('SERVICE_BACKEND_WS_PREFIX');

const { app } = expressWs(express());

app.use(express.json(), cookieParser(), verifySessionMiddleware);

app.ws(`/${wsPrefix}`, function (ws, req) {
  if (req.user) {
    console.log('connected');
    socketsService.initSocket(ws, req.user);
  } else {
    console.log('not connected');
    ws.close();
  }
});

app.use(`/${getEnvVar('SERVICE_BACKEND_GLOBAL_PREFIX')}`, apiRouter);

const server = app.listen(port, () => {
  console.log(`Listening at http://${hostname}:${port}/${globalPrefix}`);
});
server.on('error', console.error);
