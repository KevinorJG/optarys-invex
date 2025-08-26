import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    //cors: true,
    logger: new ConsoleLogger({
      prefix: "INVEX-API",
      logLevels: ['log', 'error', 'warn']
    })
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
