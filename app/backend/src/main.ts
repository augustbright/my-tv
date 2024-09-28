/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import { getEnvVar } from 'server-utils';
import expressWs from 'express-ws';
import { apiRouter } from './api';
import cookieParser from 'cookie-parser';

const port = getEnvVar('SERVICE_BACKEND_PORT');
const hostname = getEnvVar('SERVICE_BACKEND_HOSTNAME');
const globalPrefix = getEnvVar('SERVICE_BACKEND_GLOBAL_PREFIX');

const { app } = expressWs(express());

app.use(express.json());
app.use(cookieParser());

app.ws('/echo', function (ws, req) {
  ws.on('message', function (msg) {
    ws.send(msg);
  });
});

app.use(`/${getEnvVar('SERVICE_BACKEND_GLOBAL_PREFIX')}`, apiRouter);

const server = app.listen(port, () => {
  console.log(`Listening at http://${hostname}:${port}/${globalPrefix}`);
});
server.on('error', console.error);
