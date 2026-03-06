import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { Repository,In} from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersService } from 'src/users/users.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Posts) 
        private postsRepository: Repository<Posts>,
       
        private usersService: UsersService 
    ) {}

    async createPost(dto: CreatePostDto,authorId:number) {
        
        const user = await this.usersService.findOne(authorId);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const post = this.postsRepository.create({
            ...dto,
            author: user 
        });

        return await this.postsRepository.save(post);
    }


    async getAllPosts(){
        return await this.postsRepository.find({relations:['author']});
    }

    async remove(id:number,userId:number){
        const post = await this.postsRepository.findOne({
            where:{id},
            relations:['author']
        });
        if(post?.author.id !== userId){
            throw new NotFoundException('You are not the author of this post');
        }

        return await this.postsRepository.delete(id);

    }

    async update(id:number,userId:number,updateDto:UpdatePostDto){
        const post = await this.postsRepository.findOne({
            where:{id},
            relations:['author']
        })
        if(!post){
            throw new NotFoundException('Post is not found');
        }

       
        
        if(post.author.id !== userId){
            throw new ForbiddenException('You are not the author of this post');
        }

        
        Object.assign(post,updateDto);

        return await this.postsRepository.save(post);
    }

    

    async getFeed(userId:number){
        const me = await this.usersService.findWithFollowing(userId);

        if(!me){
            throw new NotFoundException("The user is not found");
        }
        const followingIds = me.following.map(user => user.id);
        
        if (followingIds.length === 0) {
            return [];
        }

        return await this.postsRepository.find({
            where:{
                author:{
                    id:In(followingIds)
                }
            },
            relations:['author'],
            order:{id:'DESC'}
        })
    }
}