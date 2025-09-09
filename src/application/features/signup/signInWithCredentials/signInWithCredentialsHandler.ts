import { CommandHandler } from "@nestjs/cqrs";
import { SignInWithCredentials } from "./signInWithCredentials";
import { SignInService } from "@services/identity";
import { ICommandHandler } from "src/application/common/handlers/command-handler";

@CommandHandler(SignInWithCredentials)
export class signInWithCredentialsHandler implements ICommandHandler<SignInWithCredentials> {
    constructor(private readonly signInService: SignInService) { }

    async execute(command: SignInWithCredentials): Promise<any> {
        const { identifier, password } = command;

        const type = this.isUsernameOrEmail(identifier);
        return await this.signInService.signIn(type, identifier, password);
    }

    isUsernameOrEmail(identifier: string): 'username' | 'email' {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(identifier) ? 'email' : 'username';
    }
}