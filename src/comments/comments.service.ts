import { Injectable, NotFoundException,Inject} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from './comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentsDto } from './dto/create-comments.dto';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import Redis from 'ioredis';


@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comments) private commentsRepository: Repository<Comments>,
        private userService: UsersService,
        private postService: PostsService,
        @Inject('REDIS_CLIENT') private readonly redis:Redis
    ) {}

    async createComment(dto: CreateCommentsDto, authorId: number) {
        const post = await this.postService.findOne(dto.postId);
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const user = await this.userService.findOne(authorId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const comment = this.commentsRepository.create({
            text: dto.text, 
            author: user,   
            post: post      
        });

      
        return await this.commentsRepository.save(comment);
        const cacheKey = `feed_user${authorId}`;
        await this.redis.del(cacheKey);
        
    }
}