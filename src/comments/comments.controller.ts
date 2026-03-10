import { Controller } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentsDto } from './dto/create-comments.dto';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards ,Post,Req,Body} from '@nestjs/common';


@Controller('comments')
export class CommentsController {
    constructor(private commentsService:CommentsService){}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    createComment(@Body() commentDto:CreateCommentsDto,@Req() req){
        const authorId = req.user.userId;


        return this.commentsService.createComment(commentDto,authorId)
    }
}
