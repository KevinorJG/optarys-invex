import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UseInfrastructure } from './infrastructure/dependencyInjection';
import { UseApplication } from './application/dependencyInjection';
import { AuthService } from './application/services/identity/auth.service';
import { AuthController } from './presentation/controllers/auth/auth.controller';
import { RbcaService } from './application/services/rbca/rbca.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ...UseInfrastructure,
    ...UseApplication,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, RbcaService],
})
export class AppModule {}
