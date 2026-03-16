import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './common/redis.module';
import { CommentsModule } from './comments/comments.module';
import { FilesModule } from './files/files.module';
import { NotificationsModule } from './notifications/notifications.module';
@Module({
  imports: [
   
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),   
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: true, 
      }),
    }),
    UsersModule,
    PostsModule,
    AuthModule,
    RedisModule,
    CommentsModule,
    FilesModule,
    NotificationsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}