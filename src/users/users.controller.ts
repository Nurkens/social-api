import { Controller, Post ,Body,Get,Param, UseGuards,Req} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user-dto';
import { AuthGuard } from '@nestjs/passport';
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){}

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

}

    
    