import { IsString,IsNotEmpty,Length, IsInt } from "class-validator";


export class CreatePostDto{
    @IsString()
    @IsNotEmpty()
    @Length(5,100)
    readonly title:string;
    @IsString()
    @IsNotEmpty()
    readonly content:string;
    
}