import { Controller, Query, UseGuards,MaxFileSizeValidator,FileTypeValidator } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Get,Post ,Body,Req,Delete,Patch,Param} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { FilesService } from '../files/files.service';
import { UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ParseFilePipe } from '@nestjs/common';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService,
                private fileService:FilesService
    ){}

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async createPost(@Body() postDto:CreatePostDto,@Req() req, @UploadedFile(new ParseFilePipe({validators:[
                new MaxFileSizeValidator({maxSize:1024*1024*5}),
                new FileTypeValidator({fileType:'.(png|jpeg|jpg)$'}),
            ],})) file:Express.Multer.File){
        let fileName : string | undefined = undefined;
        if(file){
            fileName = await this.fileService.uploadFile(file,'posts');
        }
        const userId = req.user.userId;
        return this.postsService.createPost(postDto,userId,fileName);

    }
    
    @Get()
    getAllPosts(){
        return this.postsService.getAllPosts();
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    deletePost(@Param('id') id:string, @Req() req){
        const userId = req.user.userId;
        return this.postsService.remove(+id,userId);
    }
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    updatePost(@Param('id') id:string, @Req() req, @Body() updateDto:UpdatePostDto){
        const userId = req.user.userId;
        return this.postsService.update(+id,userId,updateDto);
    }
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get('feed')
    getFeed(@Req() req,@Query('page') page:string = '1',@Query('limit') limit:string = '10') {
        const userId = req.user.userId;
        return this.postsService.getFeed(userId,+page,+limit);
    }
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post(':id/like')
    toggleLike(@Param('id') postId:string,@Req() req){
        const userId = req.user.userId;
        return this.postsService.toggleLike(userId,+postId)
    }

    
}
