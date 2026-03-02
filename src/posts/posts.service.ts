import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Posts) 
        private postsRepository: Repository<Posts>,
       
        private usersService: UsersService 
    ) {}

    async createPost(dto: CreatePostDto) {
        
        const user = await this.usersService.findOne(dto.authorId);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const post = this.postsRepository.create({
            ...dto,
            author: user 
        });

        return await this.postsRepository.save(post);
    }
}