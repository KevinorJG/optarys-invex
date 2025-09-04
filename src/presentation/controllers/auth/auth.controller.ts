import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SignInService } from '@services/identity';

@Controller('auth')
export class AuthController {

    constructor(private readonly signInService: SignInService) { }

    @Post('login')
    @HttpCode(200)
    async signIn(@Body() body: { username: string, password: string }) {
        return await this.signInService.signIn(body.username, body.password);
    }


}
