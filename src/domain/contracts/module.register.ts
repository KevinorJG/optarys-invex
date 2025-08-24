import { DynamicModule } from '@nestjs/common';

export abstract class ModuleRegister {
  //Permite registar agregar una firma a la clase para poder ser registrada en los modulos
  static register(): DynamicModule {
    throw new Error('Not implemented');
  }
}