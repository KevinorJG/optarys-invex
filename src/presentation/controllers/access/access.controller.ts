import { Controller, Get, HttpCode, UseInterceptors } from '@nestjs/common';
import { RbcaService } from '@services/index';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { PermissionDto, RoleDto } from '@services/rbca/dtos/index';

@Controller('access-controll')
export class AccessController {
    constructor(private readonly rbcaService: RbcaService){}

    @Get('roles')
    @HttpCode(200)
    @UseInterceptors(CacheInterceptor)
    getAllRoles(): Promise<RoleDto[]> {
        return this.rbcaService.getAllRoles();
    }

    @Get('permissions')
    @HttpCode(200)
    @UseInterceptors(CacheInterceptor)
    getAllPermissions(): Promise<PermissionDto[]> {
        return this.rbcaService.getAllPermissions();
    }

}
