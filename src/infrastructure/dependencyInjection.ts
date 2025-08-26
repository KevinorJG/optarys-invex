import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { TenantContextConfiguration } from './context/tenantDbContext/tenantContextConfiguration';

export const UseInfrastructure: (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] = [
  TenantContextConfiguration.register()
];
