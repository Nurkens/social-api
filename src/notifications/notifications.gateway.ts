import { NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect, 
  SubscribeMessage 
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    constructor(private jwtService:JwtService){}


    async handleConnection(client: any) {
        const token = client.handshake.headers.authorization;
        if(!token){
          throw new NotFoundException('The token is not found');
        }
        const [type,rawToken] = token.split(' ')
        if(type !== 'Bearer' || rawToken === ''){
            throw new NotFoundException('Token is not found');
        }
        try{
            const payload = await this.jwtService.verifyAsync(rawToken);
            
            client.join(`user_${payload.userId}`);
        }catch(e){
            client.disconnect();
        }
    }

    sendNotificaiton(userId:number,message:string){
        this.server.to(`user_${userId}`).emit('notification',message)
    }


    handleDisconnect(client: any) {
      console.log('Client disconnected: ', client.id);
    }

    @SubscribeMessage('message')
    handleMessage(client: any, payload: any): string {
      return 'Hello world!';
    }
}