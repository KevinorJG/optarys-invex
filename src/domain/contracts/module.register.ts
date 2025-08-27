import { DynamicModule } from '@nestjs/common';

/**
  * Clase abstracta que define un contrato para registrar módulos en la aplicación.
  * Cualquier módulo que implemente esta clase debe proporcionar una implementación
  * del método estático `register`, que devuelve un `DynamicModule`.
*/
export abstract class ModuleRegister {
  //Permite registar agregar una firma a la clase para poder ser registrada en los modulos
  static register(): DynamicModule {
    throw new Error('Not implemented');
  }

  
}