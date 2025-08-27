import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { SignInService, LoggerService, RbcaService } from '@services/index';


export class ApplicationConfiguration {
    static modulesCollection(): (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] {
        return [
           
        ];

    }

    static servicesCollection(): any[] {
        return [
            LoggerService, 
            SignInService, 
            RbcaService
        ];
    }
}

export const UseApplication: (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] = [

];

export const ApplicationServices = [
    LoggerService, 
    SignInService, 
    RbcaService
]