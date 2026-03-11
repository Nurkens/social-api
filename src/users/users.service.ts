import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user-dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

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

    async getProfileByUsername(username:string){
         const profile = await this.userRepository.findOne({
            where:{username},
            relations:['posts']
        });

         if(!profile){
            throw new NotFoundException('No profile with this username');
         }

         return plainToInstance(User,profile);

    }

    async follow(userId:number,targetId:number){
        if(userId === targetId){
            throw new BadRequestException('You cannot follow to yourself');
        }
        const me = await this.userRepository.findOne({
            where:{id:userId},
            relations:['following']
        })

        if(!me){
            throw new NotFoundException('Current user not found')
        }
        const targetUser = await this.userRepository.findOne({where:{id:targetId}});
        if(!targetUser){
            throw new NotFoundException('Target user not found');
        }

        const isAlreadyFollowed = me.following.some(user => user.id === targetId);
        if(isAlreadyFollowed){
            return {message:'You are already followed to this user'}
        }

        me.following.push(targetUser);

        await this.userRepository.save(me);

        return {message:'Successfully followed'};
    }
    async findWithFollowing(id: number): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { id },
            relations: ['following'] 
        });
    }

    async updateAvatar(userId:number,fileName:string){
        return await this.userRepository.update(userId,{avatar:fileName})
    }
}
