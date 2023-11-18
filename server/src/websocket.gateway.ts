import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';
import { SocketService } from './socket.service';
import { UserService } from './user.service';
import {
  ClearVotesRoomMessage,
  ClientToServerEvents,
  JoinRoomMessage,
  Room,
  RoomMessage,
  ServerToClientEvents,
  ShowVotesRoomMessage,
  VoteMessage,
} from './models';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebSocket implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents
  >();

  constructor(
    private readonly roomService: RoomService,
    private readonly socketService: SocketService,
    private readonly userService: UserService,
  ) {}

  async handleDisconnect(client: Socket) {
    console.log('client disconnected', client.id, client.rooms);
    const rooms = await this.socketService.list(client.id);
    const user = await this.userService.get(client.id);
    await this.socketService.leaveAll(client.id);

    await Promise.all(
      rooms.map(async (room) => {
        room.members = room.members.filter((m) => m !== user.name);
        await this.roomService.update(room);
        this.sendRoomUpdate(room);
      }),
    );
  }

  async handleConnection(client: any, ...args: any[]) {
    console.log('new connection!', client.id);
  }

  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody() message: JoinRoomMessage,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('join received', message);
    this.userService.set(client.id, { name: message.user });
    let room = await this.roomService.get(message.room);
    if (room) {
      if (!room.members.includes(message.user)) {
        room.members = [...room.members, message.user];
        room = await this.roomService.update(room);
        console.log('updated room', room);
        this.server.in(client.id).socketsJoin(room.id);
        client.join(room.id);
        this.socketService.join(client.id, room);
        this.sendRoomUpdate(room);
      }
    }
  }

  @SubscribeMessage('clearVotes')
  async handleClearVotes(
    @MessageBody() message: ClearVotesRoomMessage,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('clearVotes received', message);
    const room = await this.roomService.get(message.room);
    if (room) {
      room.areVotesVisible = false;
      room.votes = [];
      this.roomService.update(room);
      this.sendRoomUpdate(room);
    }
  }

  @SubscribeMessage('vote')
  async handleVote(
    @MessageBody() message: VoteMessage,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('vote received', message);
    const room = await this.roomService.get(message.room);
    if (room) {
      const existingVote = room.votes.find((v) => v.user == message.user);

      if (existingVote) {
        existingVote.points = message.points;
      } else {
        room.votes.push({ user: message.user, points: message.points });
      }

      if (
        !room.areVotesVisible &&
        room.members.length ===
          room.votes.filter((v) => v.points != undefined).length
      ) {
        room.areVotesVisible = true;
      }
      this.roomService.update(room);
      this.sendRoomUpdate(room);
    }
  }

  @SubscribeMessage('show')
  async handleShow(
    @MessageBody() message: ShowVotesRoomMessage,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('show received', message);
    const room = await this.roomService.get(message.room);
    if (room) {
      room.areVotesVisible = message.show;
      this.roomService.update(room);
      this.sendRoomUpdate(room);
    }
  }

  private sendRoomUpdate(room: Room) {
    this.server.to(room.id).emit('room', { room } as RoomMessage);
  }
}
