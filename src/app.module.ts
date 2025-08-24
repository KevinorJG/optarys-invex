import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UseInfrastructure } from './infrastructure/dependencyInjection';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ...UseInfrastructure
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
