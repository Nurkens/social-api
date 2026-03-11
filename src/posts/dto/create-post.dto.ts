import { ApiProperty } from "@nestjs/swagger";
import { IsString,IsNotEmpty,Length, IsInt } from "class-validator";


export class CreatePostDto{

    @ApiProperty({example:"My first post",description:"Post"})
    @IsString()
    @IsNotEmpty()
    @Length(5,100)
    readonly title:string;

    @ApiProperty({example:"This post about swagger",description:"Post content"})
    @IsString()
    @IsNotEmpty()
    readonly content:string;
    
}