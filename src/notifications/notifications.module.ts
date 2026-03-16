
import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [NotificationsGateway], 
  exports: [NotificationsGateway],   
  imports:[AuthModule]
})
export class NotificationsModule {}