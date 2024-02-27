import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Room } from './models';
import { InMemoryRoomRepository } from './room.repository';
import { RoomService } from './room.service';
import { SocketService } from './socket.service';
import typeormConfig from './typeorm.config';
import { UserService } from './user.service';
import { WebSocket } from './websocket.gateway';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    TypeOrmModule.forFeature([Room]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    WebSocket,
    RoomService,
    SocketService,
    UserService,
    InMemoryRoomRepository,
  ],
})
export class AppModule {}
