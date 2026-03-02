import { Controller, Post ,Body,Get,Param} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user-dto';
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
}

    
    