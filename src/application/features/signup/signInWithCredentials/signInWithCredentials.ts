import { Command } from '@nestjs/cqrs';

export class SignInWithCredentials extends Command<{res: string}> {

  constructor(public readonly identifier: string, public readonly password: string) {
    super();
  }

}