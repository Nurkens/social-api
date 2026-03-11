import { Controller, Post ,Body,Get,Param, UseGuards,Req, UseInterceptors, UploadedFile} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user-dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from 'src/files/files.service';

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
    @Get(':id')
    findOne(@Param('id') id:number ){
        return this.usersService.findOne(id);
    }

    @Get('profile/:username')
    getProfile(@Param('username') username:string){
        return this.usersService.getProfileByUsername(username);
    }
    @UseGuards(AuthGuard('jwt'))
    @Post('follow/:id')
    followUser(@Param('id') targetId:number, @Req() req){
        const userId = req.user.userId;
        return this.usersService.follow(userId,+targetId)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('avatar')
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(@UploadedFile() file ,@Req() req){
        const fileName = await this.filesService.uploadFile(file)
        return this.usersService.updateAvatar(req.user.userId,fileName)
    }
}

    
    