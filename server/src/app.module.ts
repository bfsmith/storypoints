import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
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
    ServeStaticModule.forRoot({
      rootPath:
        process.env.NODE_ENV === 'production'
          ? join(__dirname, '..', 'web')
          : join(__dirname, '..', '..', 'web', 'dist'),
    }),
  ],
  controllers: [AppController, HealthController],
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
