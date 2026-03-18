import { Controller, Post ,Body,Get,Param, UseGuards,Req, UseInterceptors, UploadedFile, MaxFileSizeValidator, FileTypeValidator, UseFilters,Query} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user-dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from 'src/files/files.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ParseFilePipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService,private filesService:FilesService){}

    @Post()
    create(@Body() userDto:CreateUserDto){
        return this.usersService.createUser(userDto);
    }
    
    @Get()
    getAllUsers(){
        return this.usersService.getAllUsers();
    }

    @Get('search')
    searchUsername(@Query('q') query:string){
        return this.usersService.search(query);
    }

    @Get(':id')
    findOne(@Param('id') id:number ){
        return this.usersService.findOne(id);
    }

    @Get('profile/:username')
    getProfile(@Param('username') username:string){
        return this.usersService.getProfileByUsername(username);
    }
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('follow/:id')
    followUser(@Param('id') targetId:string, @Req() req){
        const userId = req.user.userId;
        return this.usersService.follow(userId,+targetId)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('avatar')
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(@UploadedFile(new ParseFilePipe({
        validators:[
            new MaxFileSizeValidator({maxSize:1024*1024*2}),
            new FileTypeValidator({fileType:'.(png|jpeg|jpg)$'}),
        ],
    })) file ,@Req() req){
        const fileName = await this.filesService.uploadFile(file,'avatars')
        return this.usersService.updateAvatar(req.user.userId,fileName)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('unfollow/:id')
    unfollow(@Req() req , @Param('id') targetId:string){
        const userId = req.user.userId;
        return this.usersService.unfollow(userId,+targetId)
    }

    

}

    
    