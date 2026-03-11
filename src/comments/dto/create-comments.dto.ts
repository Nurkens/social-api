
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentsDto{
    @ApiProperty({example:"You did really good!",description:"Comments"})
    readonly text: string;
    @ApiProperty({example:"1",description:"id of post, comment belongs to "})
    readonly postId: number;
}