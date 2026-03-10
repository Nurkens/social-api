import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from './comment.entity';
import { PostsModule } from 'src/posts/posts.module';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports:[
    TypeOrmModule.forFeature([Comments]),
    PostsModule,
    UsersModule
  ],
  providers: [CommentsService],
  controllers: [CommentsController]
})
export class CommentsModule {}
