import { CreateAccount } from "@features/account";
import { Body, Controller, Post } from "@nestjs/common";
import { MediatorService } from "@services/mediator";

@Controller('account')
export class AccountController {

    constructor(private readonly mediator: MediatorService){}

    @Post('create')
    async crateAccount(@Body() request: CreateAccount){
        return await this.mediator.execute(request);
    }
}