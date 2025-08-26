import { TenantContext } from '@contexts/index';
import { Role, Permission } from '@models/index';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RbcaService {
    private readonly logger = new Logger(RbcaService.name);

    constructor(private readonly tenantContext: TenantContext) { }

    /**
     * Obtiene los roles de un usuario
     */
    async getUserRoles(userId: number): Promise<Role[]> {
        this.logger.log(`Obteniendo roles para usuario ${userId}`);
        const roles = await this.tenantContext.roles
            .createQueryBuilder('role')
            .innerJoin('role.userRoles', 'ur')
            .where('ur.userId = :userId', { userId })
            .getMany();
        this.logger.log(`Roles obtenidos para usuario ${userId}: ${roles.length}`);
        return roles;
    }

    /**
     * Obtiene los permisos de un usuario (roles + directos)
     */
    async getUserPermissions(userId: number): Promise<Permission[]> {
        this.logger.log(`Obteniendo permisos de roles para usuario ${userId}`);
        const rolePerms = await this.tenantContext.permissions
            .createQueryBuilder('perm')
            .innerJoin('perm.rolePermissions', 'rp')
            .innerJoin('rp.role', 'role')
            .innerJoin('role.userRoles', 'ur')
            .where('ur.userId = :userId', { userId })
            .getMany();
        this.logger.log(`Permisos de roles obtenidos: ${rolePerms.length}`);

        this.logger.log(`Obteniendo permisos directos para usuario ${userId}`);
        const directPerms = await this.tenantContext.permissions
            .createQueryBuilder('perm')
            .innerJoin('perm.userPermissions', 'up')
            .where('up.userId = :userId', { userId })
            .getMany();
        this.logger.log(`Permisos directos obtenidos: ${directPerms.length}`);

        // combinar y quitar duplicados por id
        const all = [...rolePerms, ...directPerms];
        const unique = new Map(all.map(p => [p.id, p]));
        const finalCount = unique.size;
        this.logger.log(`Total de permisos únicos para usuario ${userId}: ${finalCount}`);

        return [...unique.values()];
    }

    /**
     * Obtiene todos los roles disponibles
     */
    async getAllRoles(): Promise<Role[]> {
        this.logger.log('Obteniendo todos los roles');
        const roles = await this.tenantContext.roles.find();
        this.logger.log(`Roles obtenidos: ${roles.length}`);
        return roles;
    }
}

