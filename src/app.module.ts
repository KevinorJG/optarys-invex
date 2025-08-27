import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Configuracion de capas
import { InfrastructureConfiguration } from './infrastructure/dependencyInjection';
import { ApplicationConfiguration } from './application/dependencyInjection';
import { PresentationConfiguration } from './presentation/dependencyInjection';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ...InfrastructureConfiguration.modulesCollection(),
    ...ApplicationConfiguration.modulesCollection(),
  ],
  controllers: [
    ...PresentationConfiguration.useControllers()
  ],
  providers: [
    ...ApplicationConfiguration.servicesCollection(),
    ...InfrastructureConfiguration.servicesCollection()
  ],
})
export class AppModule { }
