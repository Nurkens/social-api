import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";



export class CreateAuthDto{

    @IsString()
    @IsEmail()
    readonly email:string;

    @IsNotEmpty()
    @Length(6,15)
    readonly password:string;
}