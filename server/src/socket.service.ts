import { Injectable } from '@nestjs/common';
import { Room } from './models';

@Injectable()
export class SocketService {
  /**
   * SocketId => Rooms[]
   */
  private readonly sockets: Record<string, Room[]> = {};

  async join(socketId: string, room: Room): Promise<void> {
    const rooms: Room[] = this.sockets[socketId] ?? [];
    if (!rooms.some((r) => r.id == room.id)) {
      this.sockets[socketId] = [...rooms, room];
    }
  }

  async list(socketId: string): Promise<Room[]> {
    const rooms: Room[] = this.sockets[socketId] ?? [];
    return rooms;
  }

  async leave(socketId: string, room: Room): Promise<void> {
    const rooms: Room[] = this.sockets[socketId] ?? [];
    this.sockets[socketId] = rooms.filter((r) => r.id !== room.id);
  }

  async leaveAll(socketId: string): Promise<void> {
    delete this.sockets[socketId];
  }
}
