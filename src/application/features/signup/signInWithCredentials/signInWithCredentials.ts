import { Command } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class SignInWithCredentials extends Command<any> {
  @ApiProperty({
    examples: ['Myusername', 'emailexanmple@gmail.com'],
    description: 'Username o correo del usuario',
  })
  @IsNotEmpty()
  public identifier: string;

  @ApiProperty({
    example: 'mypasswordsecure',
    description: 'Contraseña del usuario',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  public password: string;

  
}
