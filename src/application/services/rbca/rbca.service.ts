import { TenantContext } from '@contexts/index';
import { Role, Permission } from '@models/index';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RbcaService {
    private readonly logger = new Logger(RbcaService.name);

    constructor(
        private readonly tenantContext: TenantContext,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

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
    /**
   * Obtiene todos los roles disponibles con caché en memoria
   */
    async getAllRoles(): Promise<Role[]> {
        this.logger.log('Obteniendo todos los roles con caché en memoria');

        // Verificar si los roles están en caché
        const cachedRoles = await this.cacheManager.get<Role[]>('all_roles_cache');
        if (cachedRoles) {
            this.logger.log('Roles obtenidos desde caché');
            return cachedRoles;
        }

        // Si no están en caché, obtenerlos de la base de datos
        const roles = await this.tenantContext.roles
            .createQueryBuilder('role')
            .select(['role.external_id', 'role.name', 'role.description'])
            .getMany();

        // Almacenar los roles en caché por 2 minutos
        await this.cacheManager.set('all_roles_cache', roles ); // 120 segundos = 2 minutos

        this.logger.log(`Roles obtenidos: ${roles.length}`);
        return roles;
    }


}

