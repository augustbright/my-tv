/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import {getEnvVar} from 'server-utils';

async function bootstrap() {
  const globalPrefix = getEnvVar('SERVICE_BACKEND_GLOBAL_PREFIX');
  const port = getEnvVar('SERVICE_BACKEND_PORT');
  const hostname = getEnvVar('SERVICE_BACKEND_HOSTNAME');

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(globalPrefix);
  await app.listen(port);
  Logger.log(
    `🚀 Backend service is running on: http://${hostname}:${port}/${globalPrefix}`
  );
}

bootstrap();
