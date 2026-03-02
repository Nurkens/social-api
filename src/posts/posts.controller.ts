import { Controller } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Get,Post ,Body} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService){}

    @Post()
    createPost(@Body() postDto:CreatePostDto){
        return this.postsService.createPost(postDto);
    }
    
    

}
