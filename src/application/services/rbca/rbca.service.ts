import { TenantContext } from '@contexts/index';
import { Role, Permission } from '@models/index';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RoleDto, PermissionDto } from './dtos/index';
import { CACHE_MANAGER, Cache} from '@nestjs/cache-manager';

@Injectable()
export class RbcaService {

    private readonly loggerService = new Logger(RbcaService.name);
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly tenantContext: TenantContext,
    ) {}

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
        const cacheKey = 'all_roles';
        let roles: RoleDto[] | undefined = await this.cacheManager.get<RoleDto[]>(cacheKey);

        if (!roles) {
            this.loggerService.log(`[Roles] Cache MISS: consultando en base de datos`);
            const dbRoles = await this.tenantContext.roles
                .createQueryBuilder('role')
                .select(['role.externalId', 'role.name', 'role.description'])
                .getMany();

            roles = dbRoles.map(role => ({
                id: role.externalId,
                name: role.name,
                description: role.description,
            }));

            await this.cacheManager.set(cacheKey, roles);
            this.loggerService.log(`[Roles] Guardados en cache (${roles.length} roles)`);
        } else {
            this.loggerService.log(`[Roles] Cache HIT: obtenidos ${roles.length} roles de la cache`);
        }
        
        return roles;
    }

    /**
     * Obtiene todos los permisos disponibles con caché en memoria
     */
    async getAllPermissions(): Promise<PermissionDto[]> {
        const cacheKey = 'all_permissions';
        let permissions: PermissionDto[] | undefined = await this.cacheManager.get<PermissionDto[]>(cacheKey);

        if (!permissions) {
            this.loggerService.log(`[Permisos] Cache MISS: consultando en base de datos`);
            const dbPermissions = await this.tenantContext.permissions
                .createQueryBuilder('perm')
                .select(['perm.externalId', 'perm.name', 'perm.description'])
                .getMany();

            permissions = dbPermissions.map(perm => ({
                id: perm.externalId,
                name: perm.name,
                description: perm.description,
            }));

            await this.cacheManager.set(cacheKey, permissions);
            this.loggerService.log(`[Permisos] Guardados en cache (${permissions.length} permisos)`);
        } else {
             this.loggerService.log(`[Permisos] Cache HIT: obtenidos ${permissions.length} permisos de la cache`);
        }
       
        return permissions;
    }

}

