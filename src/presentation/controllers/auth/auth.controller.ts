import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SignInWithCredentials } from '@features/signInWithCredentials';
import { MediatorService } from '@services/mediator';

@Controller('auth')
export class AuthController {

    constructor(private readonly mediator: MediatorService) { }

    @Post('login')
    @HttpCode(200)
    async signIn(@Body() body: { identifier: string, password: string }) {
        return await this.mediator.execute(
            new SignInWithCredentials(body.identifier, body.password)
        );
    }


}
