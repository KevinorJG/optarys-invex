import { IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SignInWithCredentials } from "@features/signup";

export class SignInWithCredentialsDto extends SignInWithCredentials {

    @ApiProperty({
        examples: ["MyUsername","micorreo@dominio.com"],
        description: "Username o correo del usuario",
    })
    @IsNotEmpty()
    public declare identifier: string;

    @ApiProperty({
        example: "mypasswordsecure",
        description: "Contraseña del usuario",
        minLength: 6,
    })
    @IsNotEmpty()
    @MinLength(6)
    public declare password: string;

    constructor(identifier: string, password: string) {
        super(identifier, password);
    }
}