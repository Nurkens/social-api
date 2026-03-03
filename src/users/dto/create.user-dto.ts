import { IsEmail, IsNotEmpty ,Length,IsString} from "class-validator";

export class CreateUserDto{

    @IsEmail()
    readonly email: string;
    @IsNotEmpty()
    @Length(8,10)
    readonly password: string;
    @IsNotEmpty()
    @IsString()
    readonly username:string;
}