/*
 * This is only a minimal custom server to get started.
 * You may want to consider using Express or another server framework, and enable security features such as CORS.
 *
 * For an example, see the Next.js repo:
 * Node - https://github.com/vercel/next.js/blob/canary/examples/custom-server
 */
import { parse } from 'node:url';
import * as path from 'path';
import next from 'next';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { Request, Response } from 'express';
import { getEnvVar } from 'server-utils';

// Next.js server options:
// - The environment variable is set by `@nx/next:server` when running the dev server.
// - The fallback `__dirname` is for production builds.
// - Feel free to change this to suit your needs.

const dir = path.join(__dirname, '../../../app/web');
const dev = getEnvVar('NODE_ENV') === 'development';
// HTTP Server options:
// - Feel free to change this to suit your needs.
const hostname = getEnvVar('SERVICE_WEB_HOSTNAME');
const port = parseInt(getEnvVar('SERVICE_WEB_PORT'));
const apiPrefix = getEnvVar('NEXT_PUBLIC_SERVICE_WEB_API_PREFIX');
const wsPrefix = getEnvVar('NEXT_PUBLIC_SERVICE_WEB_WS_PREFIX');

const backendHostname = getEnvVar('SERVICE_BACKEND_HOSTNAME');
const backendPort = getEnvVar('SERVICE_BACKEND_PORT');
const backendWsPort = getEnvVar('SERVICE_BACKEND_WS_PORT');
const backendGlobalPrefix = getEnvVar('SERVICE_BACKEND_GLOBAL_PREFIX');

const proxyBackendMiddleware = createProxyMiddleware<Request, Response>({
  target: `http://${backendHostname}:${backendPort}/${backendGlobalPrefix}`,
  changeOrigin: true,
});

const proxyBackendWSMiddleware = createProxyMiddleware<Request, Response>({
  target: `http://${backendHostname}:${backendWsPort}/${backendGlobalPrefix}`,
  changeOrigin: true,
});

async function main() {
  const expressApp = express();
  const nextApp = next({ dev, dir });
  const handle = nextApp.getRequestHandler();

  await nextApp.prepare();

  expressApp.use(`/${apiPrefix}`, proxyBackendMiddleware);
  expressApp.use(`/${wsPrefix}`, proxyBackendWSMiddleware);

  expressApp.use((req, res) => {
    const parsedUrl = parse(req.url ?? '', true);
    handle(req, res, parsedUrl);
  });

  expressApp.listen(port, () => {
    console.log(`🚀 Web server is listening on: http://${hostname}:${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
