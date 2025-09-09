import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { MediatorService } from '@services/mediator';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { SignInWithCredentialsDto } from './requests/SignInWithCredentialsDTO';

@Controller('auth')
export class AuthController {
  constructor(private readonly mediator: MediatorService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    content: {

    }
  })
  @ApiBody({ type: SignInWithCredentialsDto, required: true })
  async signIn(@Body() request: SignInWithCredentialsDto) {

    const result = await this.mediator.execute(request);

    return result.match(
      (value) => value,
      (error, details) => (details)
    );
  }
}
