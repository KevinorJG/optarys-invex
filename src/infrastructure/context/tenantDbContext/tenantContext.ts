import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import {
  User,
  Role,
  Permission,
  Tenant,
  UserStatus,
  TenantStatus,
  UserRole,
  RolePermission,
  UserPermission,
} from '@models/index';
import { InjectDataSource } from '@nestjs/typeorm';
import { tenantDataSourceName } from './tenantContextConfiguration';

@Injectable()
export class TenantContext {
  constructor(
    @InjectDataSource('TenantContext')
    private readonly dataSource: DataSource
  ) {}

  get users(): Repository<User> {
    return this.dataSource.getRepository(User);
  }

  get roles(): Repository<Role> {
    return this.dataSource.getRepository(Role);
  }

  get permissions(): Repository<Permission> {
    return this.dataSource.getRepository(Permission);
  }

  get tenants(): Repository<Tenant> {
    return this.dataSource.getRepository(Tenant);
  }

  get userStatuses(): Repository<UserStatus> {
    return this.dataSource.getRepository(UserStatus);
  }

  get tenantStatuses(): Repository<TenantStatus> {
    return this.dataSource.getRepository(TenantStatus);
  }

  get userRoles(): Repository<UserRole> {
    return this.dataSource.getRepository(UserRole);
  }

  get rolePermissions(): Repository<RolePermission> {
    return this.dataSource.getRepository(RolePermission);
  }

  get userPermissions(): Repository<UserPermission> {
    return this.dataSource.getRepository(UserPermission);
  }
}
