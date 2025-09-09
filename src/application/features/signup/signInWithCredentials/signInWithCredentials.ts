import { Command } from '@nestjs/cqrs';
import { SignInResponseDto } from '@services/identity';

export class SignInWithCredentials extends Command<SignInResponseDto> {

  constructor(public readonly identifier: string, public readonly password: string) {
    super();
  }

}