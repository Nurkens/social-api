import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { NotificationsGateway } from "./notifications.gateway";
@Processor('notifications')
export class NotificationProcessor extends WorkerHost{
    constructor(private notificationsGateway:NotificationsGateway){
        super()
    }
    async process(job:Job<any>){
        const {userId,message} = job.data;
        console.log(`Worker: processing task from queue of user ${userId}`)
        await this.notificationsGateway.sendNotification(userId,message)
    }
}