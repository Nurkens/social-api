import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm"
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal:true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRESS_USERNAME,
      password: process.env.POSTGRESS_PASSWORD,
      database: process.env.POSTGRESS_DB,
      entities: [],
      synchronize: true,
    }),
    UsersModule
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
