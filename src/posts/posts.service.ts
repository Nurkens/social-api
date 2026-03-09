import { ForbiddenException, Injectable, NotFoundException ,Inject} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { Repository,In} from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersService } from 'src/users/users.service';
import { UpdatePostDto } from './dto/update-post.dto';
import Redis from 'ioredis';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Posts) 
        private postsRepository: Repository<Posts>,
       
        private usersService: UsersService,
        @Inject('REDIS_CLIENT') private readonly redis:Redis
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

    

    async getFeed(userId: number) {
        const cacheKey = `feed_user_${userId}`;
        const cachedData = await this.redis.get(cacheKey);

        if (cachedData) {
            const plainPosts = JSON.parse(cachedData)
            return plainToInstance(Posts,plainPosts);
        }

        const me = await this.usersService.findWithFollowing(userId);

        if (!me) {
            throw new NotFoundException('User not found');
        }

        const followingIds = me.following.map((user) => user.id);

        if (followingIds.length === 0) {
            return [];
        }

        const posts = await this.postsRepository.find({
            where: {
                author: { id: In(followingIds) },
            },
            relations: ['author'],
            order: { id: 'DESC' },
        });

        await this.redis.set(cacheKey, JSON.stringify(posts), 'EX', 60);

        return posts;
    }
    async toggleLike(userId:number,postId:number){
        const posts = await this.postsRepository.findOne({
            where:{id:postId},
            relations:['likes']
        })
        
        if(!posts){
            throw new NotFoundException("Post is not found");
        }

        const user = await this.usersService.findOne(userId);
        if(!user){
            throw new NotFoundException("User is not found");
        }
        const isAlreadyLiked = posts.likes.some(u => u.id === user.id);
        if(isAlreadyLiked){
            posts.likes = posts.likes.filter(u => u.id!== userId)
        }else{
            posts.likes.push(user);
        }
        await this.postsRepository.save(posts)
        const cacheKey = `feed_user${userId}`;
        await this.redis.del(cacheKey);

        return {liked:!isAlreadyLiked}
    }
}