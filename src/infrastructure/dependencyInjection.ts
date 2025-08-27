import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { TenantContextConfiguration } from './context/tenantDbContext/tenantContextConfiguration';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

export class InfrastructureConfiguration {
  static modulesCollection(): (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] {
    return [
      CacheModule.register({
        ttl: 120, // seconds
        max: 100, // maximum number of items in cache
      }),
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
