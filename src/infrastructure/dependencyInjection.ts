import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { UseDbContext } from './context/TenantDbContext/tenantContextConfiguration';

export const UseInfrastructure: (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] = [
  UseDbContext.register()
];
