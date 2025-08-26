import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UseInfrastructure } from './infrastructure/dependencyInjection';
import { UseApplication } from './application/dependencyInjection';
import { AuthController } from './presentation/controllers/auth/auth.controller';
import { RbcaService } from './application/services/rbca/rbca.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 120, // seconds
      max: 100, // maximum number of items in cache
    }),
    ...UseInfrastructure,
    ...UseApplication,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, RbcaService],
})
export class AppModule { }
