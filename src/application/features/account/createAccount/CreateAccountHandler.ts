import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateAccount } from "./createAccount";
import { TenantContext } from "@contexts/tenant";
import { Logger } from "@nestjs/common";

@CommandHandler(CreateAccount)
export class CreateAccountHandler implements ICommandHandler<CreateAccount> {

    private readonly loggerService = new Logger(CreateAccountHandler.name);
    
    constructor(private readonly context: TenantContext) { }

    async execute(command: CreateAccount): Promise<any> {
        // Logic to create an account goes here
        return { success: true, message: "Account created successfully" };
    }
}