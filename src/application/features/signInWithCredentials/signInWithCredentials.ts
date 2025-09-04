import { Command } from "@nestjs/cqrs";

export class SignInWithCredentials extends Command<any> {
    constructor(
        public readonly identifier: string,
        public readonly password: string) {
        super();
    }
}