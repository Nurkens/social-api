import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post,Body} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    
    @Post('login')
    login(@Body() authDto:CreateAuthDto){
        return this.authService.login(authDto.email,authDto.password);
    }
}
