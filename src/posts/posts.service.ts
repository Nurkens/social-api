import { ForbiddenException, Injectable, NotFoundException ,Inject} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { Repository,In} from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersService } from '../users/users.service';
import { UpdatePostDto } from './dto/update-post.dto';
import Redis from 'ioredis';
import { plainToInstance } from 'class-transformer';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';


@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Posts) 
        private postsRepository: Repository<Posts>,
       
        private usersService: UsersService,
        @Inject('REDIS_CLIENT') private readonly redis:Redis,
        private notificationsGateway: NotificationsGateway
    ) {}

    async createPost(dto: CreatePostDto,authorId:number,fileName?:string) {
        
        const user = await this.usersService.findOne(authorId);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const post = this.postsRepository.create({
            ...dto,
            author: user,
            image:fileName
        });
        await this.redis.del(`feed_user${authorId}`);

        return await this.postsRepository.save(post);
    }
    async findOne(userId:number){
        return await this.postsRepository.findOne({where:{id:userId}})
    }

    async getAllPosts(){
        const posts = await this.postsRepository.find({relations:['author','likes']});

        return posts.map(post =>{
            const{likes,...postData} = post;
            return {...postData, likesCount:likes ? likes.length: 0}
        })
        
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

    

    async getFeed(userId: number,page:number,limit:number) {
        const skip = (page - 1) * limit;
        const cacheKey = `feed_user_${userId}_p${page}_l${limit}`;
        const cachedData = await this.redis.get(cacheKey);


        if (cachedData) {
            const cachedResult = JSON.parse(cachedData);
            return {
                data: plainToInstance(Posts, cachedResult.data), 
                meta: cachedResult.meta                         
            };
        }

        const me = await this.usersService.findWithFollowing(userId);

        if (!me) {
            throw new NotFoundException('User not found');
        }

        const followingIds = me.following.map((user) => user.id);

        if (followingIds.length === 0) {
            return {
                data:[],
                meta:{
                    totalItems:0,
                    itemCount:0,
                    itemsPerPage:limit,
                    totalPages:0,
                    currentPage:page
            }
            };
        }

        const [items,total] = await this.postsRepository.findAndCount({
            where: {
                author: { id: In(followingIds) },
            },
            relations: ['author', 'likes','comments','comments.author'],
            order: { id: 'DESC' },
            take:limit,
            skip:skip
        });

        const postsWithLikes = items.map(post => {
            const { likes, ...postData } = post;
            return { ...postData, likesCount: likes ? likes.length : 0 };
        })

        const result = {
            data:plainToInstance(Posts,postsWithLikes),
            meta:{
                totalItems:total,
                itemCount:postsWithLikes.length,
                itemsPerPage:limit,
                totalPages:Math.ceil(total / limit),
                currentPage:page
            }
        }
    

        await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 60);

        return result;
    }


    
    async toggleLike(userId: number, postId: number) {
        const posts = await this.postsRepository.findOne({
            where: { id: postId },
            relations: ['likes','author']
        })

        if (!posts) {
            throw new NotFoundException("Post is not found");
        }

        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new NotFoundException("User is not found");
        }
        const isAlreadyLiked = posts.likes.some(u => u.id === user.id);
        if (isAlreadyLiked) {
            posts.likes = posts.likes.filter(u => u.id !== userId)
        } else {
            posts.likes.push(user);
        }
        await this.postsRepository.save(posts)
        const postAuthorId = posts.author.id;
        await this.notificationsGateway.sendNotification(postAuthorId,'Somebody liked your post')
        const cacheKey = `feed_user_${userId}*`;
        const keys = await this.redis.keys(cacheKey)
        if(keys.length > 0){
            await this.redis.del(keys);
        }

        console.log(`sending message to room: user_${postAuthorId}`)
        

        return { liked: !isAlreadyLiked}
        
    }
}