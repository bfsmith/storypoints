import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomService } from './room.service';
import { SocketService } from './socket.service';
import { UserService } from './user.service';
import { WebSocket } from './websocket.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, WebSocket, RoomService, SocketService, UserService],
})
export class AppModule {}
