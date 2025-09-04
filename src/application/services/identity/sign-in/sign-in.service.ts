import { TenantContext } from '@contexts/tenant';
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtDto, JwtPermissionsClaim } from './dtos/jwtDto';
import { User } from '@models/user.entity';
import { RbcaService } from '@services/rbca/rbca.service';
import { SignInResponseDto } from './dtos/signInResponseDto';

@Injectable()
export class SignInService {

    private readonly loggerService = new Logger(SignInService.name);

    constructor(
        private readonly context: TenantContext,
        private readonly jwtService: JwtService,
        private readonly rbcaService: RbcaService,
    ) { }

    async signIn(signInType: 'email' | 'username', identifier: string, password: string): Promise<SignInResponseDto> {

        this.loggerService.log(`Intentando iniciar sesión para usuario: ${identifier}`);
        try {
            let query = signInType === 'email' ?
                this.context.users.createQueryBuilder('user').where('user.email = :identifier', { identifier }) :
                this.context.users.createQueryBuilder('user').where('user.username = :identifier', { identifier });

            const user = await query.getOne();

            if (!user) {
                this.loggerService.warn(`Usuario no encontrado: ${identifier}`);
                throw new NotFoundException('Usuario no encontrado');
            }
            if (!this.verifyPassword(password, user.password)) {
                this.loggerService.warn(`Contraseña inválida para usuario: ${identifier}`);
                throw new NotFoundException('Credenciales inválidas');
            }

            this.loggerService.log(`Usuario autenticado: ${user.externalId}`);
            return {
                accessToken: await this.generateJwtToken(user),
                expiresIn: 3600, // 1 hora en segundos
            };
        } catch (error) {
            this.loggerService.error(`Error en inicio de sesión para usuario: ${identifier}`, error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error interno en el servidor');
        }

    }


    private async generateJwtToken(user: User): Promise<string> {
        this.loggerService.log(`Generando token JWT para usuario ID: ${user.id}`);
        const { roles, permissions } = await this.getUserRolesAndPermissions(user.id);
        const payload: JwtDto = {
            sub: user.externalId,
            roles,
            permissions
        };
        return await this.jwtService.signAsync(payload);
    }

    private async getUserRolesAndPermissions(userId: number): Promise<{ roles: string[], permissions: JwtPermissionsClaim[] }> {
        this.loggerService.log(`Obteniendo roles y permisos para usuario ID: ${userId}`);
        try {
            const roles = await this.rbcaService.getUserRoles(userId);
            const permissions = await this.rbcaService.getUserPermissions(userId);

            return {
                roles: roles.map(r => r.name),
                permissions: permissions.map(p => ({ code: p.code, name: p.name }))
            };

        } catch (error) {
            this.loggerService.error(`Error obteniendo roles/permisos para usuario ID: ${userId}`, error.stack);
            return { roles: [], permissions: [] };
        }

    }

    private verifyPassword(providedPassword: string, storedPasswordHash: string): boolean {
        // Implementar la lógica de verificación de contraseña (hashing, comparación, etc.)
        return providedPassword === storedPasswordHash; // Ejemplo simplificado
    }

}
