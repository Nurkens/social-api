import { Inject, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User> ){}
    
    async createUser(dto: CreateUserDto){
        const salt = 10;
        const hashedPassword = await bcrypt.hash(dto.password,salt);

        const user = this.userRepository.create({
            ...dto,
            password: hashedPassword
        });
        return await this.userRepository.save(user);
    }

    async getAllUsers(){
        return await this.userRepository.find();
    }

    async findOne(id: number): Promise<User | null> {
        return await this.userRepository.findOne({ where: { id } });
    }
    async findByEmail(email:string): Promise<User | null> {
        return await this.userRepository.findOne({where:{email}});
    }
}
