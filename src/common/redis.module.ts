import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Global() 
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redis = new Redis({
          host: configService.get('REDIS_HOST') || 'localhost',
          port: configService.get('REDIS_PORT') || 6379,
        });
        console.log('--- НАСТОЯЩИЙ REDIS ПОДКЛЮЧЕН (GLOBAL) ---');
        return redis;
      },
    },
  ],
  exports: ['REDIS_CLIENT'], 
})
export class RedisModule {}