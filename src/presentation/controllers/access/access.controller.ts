import { Controller, Get, HttpCode, Logger, UseGuards } from '@nestjs/common';
import { RbcaService } from '@services/index';
import { PermissionDto, RoleDto } from '@services/rbca/dtos/index';
import { AuthGuard } from '@guards/index';

@Controller('access-controll')
@UseGuards(AuthGuard)
export class AccessController {

    constructor(private readonly rbcaService: RbcaService) { }

    @Get('roles')
    @HttpCode(200)
    getAllRoles(): Promise<RoleDto[]> {
        return this.rbcaService.getAllRoles();
    }

    @Get('permissions')
    @HttpCode(200)
    getAllPermissions(): Promise<PermissionDto[]> {
        return this.rbcaService.getAllPermissions();
    }

}
