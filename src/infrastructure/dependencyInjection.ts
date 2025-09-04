import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { TenantContextConfiguration } from './context/tenantDbContext/tenantContextConfiguration';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

export class InfrastructureConfiguration {
  static modulesCollection(): (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] {
    return [
      CacheModule.register(
        {
          isGlobal: true,
          ttl: 3600000
        }
      ), // milisegundos equivalente a 1 hora
      TenantContextConfiguration.register()
    ];

  }

  static servicesCollection(): any[] {
    return [
      {
        provide: APP_INTERCEPTOR,
        useClass: CacheInterceptor,
      }
    ];
  }
}
