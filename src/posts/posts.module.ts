import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Posts } from './posts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { FilesModule } from '../files/files.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Posts]), 
    UsersModule, 
    FilesModule
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports:[PostsService]
})
export class PostsModule {}
