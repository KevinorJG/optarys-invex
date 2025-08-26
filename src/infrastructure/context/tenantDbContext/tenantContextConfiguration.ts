// src/infrastructure/context/TenantDbContext/tenantContextConfiguration.ts
import { DynamicModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ModuleRegister } from "src/domain/contracts/module.register";
import { TenantContext } from "./tenantContext";

export const tenantDataSourceName = 'TenantContext';

export class TenantContextConfiguration extends ModuleRegister {
  static override register(): DynamicModule {
    return {
      module: TenantContextConfiguration,
      imports: [
        TypeOrmModule.forRootAsync({
          name: tenantDataSourceName, //
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            type: "postgres",
            schema: 'public',
            host: config.get<string>("DB_HOST"),
            port: config.get<number>("DB_PORT"),
            username: config.get<string>("DB_USER"),
            password: config.get<string>("DB_PASS"),
            database: config.get<string>("DB_NAME"),
            logging: true,
            cache:{
              duration: 120000 // 2 minutes
            },
            entities: [__dirname + '/../models/*.entity{.ts,.js}'], // 👈 EF-style discovery
          }),
        }),
      ],
      providers: [TenantContext], // <--- aquí
      exports: [TenantContext, TypeOrmModule],
    };
  }
}