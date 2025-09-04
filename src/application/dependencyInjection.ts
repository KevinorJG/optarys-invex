import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SignInService } from '@services/identity';
import { LoggerService, RbcaService } from '@services/index';
import { ConfigModule, ConfigService } from "@nestjs/config";

export class ApplicationConfiguration {
    static modulesCollection(): (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] {
        return [
            JwtModule.registerAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => ({
                    global: true,
                    secret: config.get<string>('JWT_SECRET'),
                    signOptions: {
                        expiresIn: config.get<string>('JWT_EXPIRATION_TIME'),
                        algorithm: 'HS256',
                    },
                }),
            }),
        ];

    }

    static servicesCollection(): any[] {
        return [
            LoggerService,
            SignInService,
            RbcaService,
           
        ];
    }
}
