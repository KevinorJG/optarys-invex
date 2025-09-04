import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignInWithCredentials } from '@features/signInWithCredentials';

@Controller('auth')
export class AuthController {

    constructor(private readonly commandBus: CommandBus) { }

    @Post('login')
    @HttpCode(200)
    async signIn(@Body() body: { identifier: string, password: string }) {
        return await this.commandBus.execute(
            new SignInWithCredentials(body.identifier, body.password)
        );
    }


}
