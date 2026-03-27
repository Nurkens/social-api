
import { Global, Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { BullModule } from '@nestjs/bullmq';
import { NotificationProcessor } from './notifications.processor';


@Global()
@Module({
  providers: [NotificationsGateway,NotificationProcessor], 
  exports: [NotificationsGateway],   
  imports:[AuthModule,BullModule.registerQueue({name:'notifications'})]
})
export class NotificationsModule {}