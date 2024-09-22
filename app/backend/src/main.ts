/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const globalPrefix = process.env.SERVICE_BACKEND_GLOBAL_PREFIX ?? 'api';
  const port = process.env.SERVICE_BACKEND_PORT ?? 3000;
  const hostname = process.env.SERVICE_BACKEND_HOSTNAME ?? 'localhost';

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(globalPrefix);
  await app.listen(port);
  Logger.log(
    `🚀 Backend service is running on: http://${hostname}:${port}/${globalPrefix}`
  );
}

bootstrap();
