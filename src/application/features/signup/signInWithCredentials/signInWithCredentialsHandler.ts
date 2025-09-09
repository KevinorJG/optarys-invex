import { CommandHandler } from "@nestjs/cqrs";
import { SignInWithCredentials } from "./signInWithCredentials";
import { SignInService, SignInResponseDto } from "@services/identity";
import { ICommandHandler } from "@common/handlers";
import { Result } from "@common/responses";

@CommandHandler(SignInWithCredentials)
export class signInWithCredentialsHandler implements ICommandHandler<SignInWithCredentials> {
    constructor(private readonly signInService: SignInService) { }
    async execute(command: SignInWithCredentials): Promise<Result<SignInResponseDto>> {
        const { identifier, password } = command;

        const type = this.isUsernameOrEmail(identifier);

        const response = await this.signInService.signIn(type, identifier, password)
        return Result.success(response);
    }

    isUsernameOrEmail(identifier: string): 'username' | 'email' {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(identifier) ? 'email' : 'username';
    }
}