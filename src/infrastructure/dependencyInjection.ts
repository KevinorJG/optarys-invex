import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { TenantContextConfiguration } from '@contexts/tenant';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

export class InfrastructureConfiguration {
  static modulesCollection(): (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] {
    return [
      CacheModule.register(
        {
          isGlobal: true,
          ttl: 3600000 // milisegundos equivalente a 1 hora
        }
      ),
      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          global: true,
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string>('JWT_EXPIRATION_TIME'),
            algorithm: 'HS256',
          },
        }),
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
