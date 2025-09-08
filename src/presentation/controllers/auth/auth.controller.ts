import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInWithCredentials } from '@features/signup/signInWithCredentials';
import { MediatorService } from '@services/mediator';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly mediator: MediatorService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({type: SignInWithCredentials})
  async signIn(@Body() request: SignInWithCredentials) {
    return await this.mediator.execute(request);
  }
}
