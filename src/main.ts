import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ConsoleLogger,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    //cors: true,
    logger: new ConsoleLogger({
      prefix: 'INVEX-API',
      logLevels: ['log', 'error', 'warn'],
    }),
  });

  app.use(['/metrics'],
    basicAuth({
      challenge: true,
      users: {
        admin: '12345'
      },
    }),
  )
  useSwagger(app);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(process.env.PORT ?? 3000);
}

async function useSwagger(app: INestApplication<any>) {
  const configService = app.get(ConfigService);

  const swaggerUser = configService.get<string>('SWAGGER_USER', 'admin');
  const swaggerPass = configService.get<string>('SWAGGER_PASS', '12345');

  app.use(
    ['/swagger', '/swagger-json'], // protege tanto UI como JSON
    basicAuth({
      challenge: true,
      users: { [swaggerUser]: swaggerPass },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Optarys Invex')
    .setDescription('Documentacion de API')
    .setVersion('1.0')
    .addTag('Controladores Principales')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);
}

bootstrap();
