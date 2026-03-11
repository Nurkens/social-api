import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class CreateAuthDto{
    @ApiProperty({example:"nurken@gmail.com",description:"Email"})
    @IsString()
    @IsEmail()
    readonly email:string;

    @ApiProperty({example:'nurken123',description:"Password"})
    @IsNotEmpty()
    @Length(6,15)
    readonly password:string;
}