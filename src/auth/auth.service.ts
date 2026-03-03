import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

    constructor(private usersService:UsersService,
                private jwtService:JwtService
    ){}

    async validate(email,password){
        const user = await this.usersService.findByEmail(email);
        if(!user){
            throw new NotFoundException("User with this email is not found ");
        }
        const compareHash = await bcrypt.compare(password,user.password);
        if(!compareHash){
            throw new UnauthorizedException("Password is not correct");
        }
        return user;

    }
    async login(email:string,password:string):Promise<{access_token:string}>{
        const user = await this.validate(email,password);

        
        
        const payload = {sub:user?.id,email:user?.email};
        return{
            access_token:await this.jwtService.signAsync(payload)
        }
    }
}
