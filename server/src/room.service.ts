import { Injectable } from '@nestjs/common';
import { Room } from './models';

@Injectable()
export class RoomService {
  private readonly rooms: Record<string, Room> = {};

  async create(room: Room): Promise<Room> {
    this.rooms[room.id] = room;
    return room;
  }

  async update(room: Room): Promise<Room> {
    this.rooms[room.id] = room;
    return room;
  }

  async list(): Promise<Room[]> {
    const allRooms = Object.values(this.rooms);
    const sortedRooms = allRooms.sort((a, b) => a.name.localeCompare(b.name));
    return sortedRooms;
  }

  async get(roomId: string): Promise<Room | undefined> {
    return this.rooms[roomId];
  }
}
