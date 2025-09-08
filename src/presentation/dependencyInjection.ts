import { Type } from "@nestjs/common";
import { AuthController } from "./controllers/auth/auth.controller";
import { HealtController } from "./controllers/healt/healt.controller";
import { AccessController } from "./controllers/access/access.controller";
import { AccountController } from "./controllers/account/account.controller";

export class PresentationConfiguration {
    static useControllers(): Type<any>[] {
        return [
           AuthController, 
           HealtController, 
           AccessController,
           AccountController
        ];
    }
}