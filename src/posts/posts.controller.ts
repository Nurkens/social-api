import { Controller, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Get,Post ,Body,Req} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService){}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    createPost(@Body() postDto:CreatePostDto,@Req() req){
        const authorId = req.user.authorId;
        return this.postsService.createPost(postDto,authorId);
    }
    
    @Get()
    getAllPosts(){
        return this.postsService.getAllPosts();
    }
    

}
