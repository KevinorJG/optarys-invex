import { Command } from "@nestjs/cqrs";
import { IsNotEmpty, MinLength } from 'class-validator';

export class SignInWithCredentials extends Command<any> {
    @IsNotEmpty()
    public readonly identifier: string;

    @IsNotEmpty()
    @MinLength(6)
    public readonly password: string;

    constructor(identifier: string, password: string) {
        super();
        this.identifier = identifier;
        this.password = password;
    }
}
