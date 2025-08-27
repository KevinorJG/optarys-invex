import { TenantContext } from '@contexts/index';
import { Role, Permission } from '@models/index';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@services/index';
import { RoleDto, PermissionDto } from './dtos/index';

@Injectable()
export class RbcaService {
    private readonly loggerService = LoggerService.forContext(RbcaService.name);

    constructor(
        private readonly tenantContext: TenantContext,
    ) { }

    /**
     * Obtiene los roles de un usuario
     */
    async getUserRoles(userId: number): Promise<Role[]> {
        this.loggerService.log(`Obteniendo roles para usuario ${userId}`);
        const roles = await this.tenantContext.roles
            .createQueryBuilder('role')
            .innerJoin('role.userRoles', 'ur')
            .where('ur.userId = :userId', { userId })
            .getMany();
        this.loggerService.log(`Roles obtenidos para usuario ${userId}: ${roles.length}`);
        return roles;
    }

    /**
     * Obtiene los permisos de un usuario (roles + directos)
     */
    async getUserPermissions(userId: number): Promise<Permission[]> {
        this.loggerService.log(`Obteniendo permisos de roles para usuario ${userId}`);
        const rolePerms = await this.tenantContext.permissions
            .createQueryBuilder('perm')
            .innerJoin('perm.rolePermissions', 'rp')
            .innerJoin('rp.role', 'role')
            .innerJoin('role.userRoles', 'ur')
            .where('ur.userId = :userId', { userId })
            .getMany();
        this.loggerService.log(`Permisos de roles obtenidos: ${rolePerms.length}`);

        this.loggerService.log(`Obteniendo permisos directos para usuario ${userId}`);
        const directPerms = await this.tenantContext.permissions
            .createQueryBuilder('perm')
            .innerJoin('perm.userPermissions', 'up')
            .where('up.userId = :userId', { userId })
            .getMany();
        this.loggerService.log(`Permisos directos obtenidos: ${directPerms.length}`);

        // combinar y quitar duplicados por id
        const all = [...rolePerms, ...directPerms];
        const unique = new Map(all.map(p => [p.id, p]));
        const finalCount = unique.size;
        this.loggerService.log(`Total de permisos únicos para usuario ${userId}: ${finalCount}`);

        return [...unique.values()];
    }


    /**
   * Obtiene todos los roles disponibles con caché en memoria
   */
    async getAllRoles(): Promise<RoleDto[]> {
        this.loggerService.log(`Obteniendo todos los roles disponibles`);
        const roles = await this.tenantContext.roles
            .createQueryBuilder('role')
            .select(['role.external_id', 'role.name', 'role.description'])
            .getMany();

        return roles.map(role => ({
            id: role.externalId,
            name: role.name,
            description: role.description,
        }));
    }

    /**
     * Obtiene todos los permisos disponibles
     */
    async getAllPermissions(): Promise<PermissionDto[]> {
        this.loggerService.log(`Obteniendo todos los permisos disponibles`);
        const permissions = await this.tenantContext.permissions
            .createQueryBuilder('perm')
            .select(['perm.externalId', 'perm.name', 'perm.description'])
            .getMany();

        return permissions.map(perm => ({
            id: perm.externalId,
            name: perm.name,
            description: perm.description,
        }));
    }

    

}

