import { v4 as uuid } from 'uuid';
import { Room } from './models';

export class InMemoryRoomRepository {
  private readonly rooms: Record<string, Room> = {};

  public save(room: Room): Room {
    if (!room.id) {
      room.id = uuid();
    }
    this.rooms[room.id] = room;
    return room;
  }

  async find(): Promise<Room[]> {
    const allRooms = Object.values(this.rooms);
    const sortedRooms = allRooms.sort((a, b) => a.title.localeCompare(b.title));
    return sortedRooms;
  }

  async findOneBy({ id }): Promise<Room | undefined> {
    const room = this.rooms[id];
    return room;
  }
}
