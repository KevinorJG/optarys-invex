import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { SignInService } from '@services/identity';
import { RbcaService } from '@services/rbca';
import { CqrsModule } from '@nestjs/cqrs';
import { featuresHandlersCollection } from '@features/handlers';

export class ApplicationConfiguration {
    static modulesCollection(): (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] {
        return [
            CqrsModule.forRoot()
        ];

    }

    static servicesCollection(): any[] {
        return [
            SignInService,
            RbcaService,
            ...featuresHandlersCollection

        ];
    }

    
}
