import { Controller, Query, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Get,Post ,Body,Req,Delete,Patch,Param} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService){}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    createPost(@Body() postDto:CreatePostDto,@Req() req){
        const userId = req.user.userId;
        return this.postsService.createPost(postDto,userId);
    }
    
    @Get()
    getAllPosts(){
        return this.postsService.getAllPosts();
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    deletePost(@Param('id') id:string, @Req() req){
        const userId = req.user.userId;
        return this.postsService.remove(+id,userId);
    }
    
    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    updatePost(@Param('id') id:string, @Req() req, @Body() updateDto:UpdatePostDto){
        const userId = req.user.userId;
        return this.postsService.update(+id,userId,updateDto);
    }
    @UseGuards(AuthGuard('jwt'))
    @Get('feed')
    getFeed(@Req() req,@Query('page') page:string = '1',@Query('limit') limit:string = '10') {
        const userId = req.user.userId;
        return this.postsService.getFeed(userId,+page,+limit);
    }
    @UseGuards(AuthGuard('jwt'))
    @Post(':id/like')
    toggleLike(@Param('id') postId:string,@Req() req){
        const userId = req.user.userId;
        return this.postsService.toggleLike(userId,+postId)
    }
}
