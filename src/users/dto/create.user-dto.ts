import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty ,Length,IsString} from "class-validator";

export class CreateUserDto{

    @ApiProperty({example:"nurken@gmail.com",description:"Email"})
    @IsEmail()
    readonly email: string;
    @ApiProperty({example:"nurken1234",description:"Password"})
    @IsNotEmpty()
    @Length(8,10)
    readonly password: string;
    @ApiProperty({example:"nurken",description:"Username"})
    @IsNotEmpty()
    @IsString()
    readonly username:string;
}