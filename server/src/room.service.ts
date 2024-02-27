import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './models';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async create(room: Room): Promise<Room> {
    const created = await this.roomRepository.save(room);
    return created;
  }

  async update(room: Room): Promise<Room> {
    const updated = await this.roomRepository.save(room);
    console.log('updated room', updated);
    return updated;
  }

  async list(): Promise<Room[]> {
    const allRooms = await this.roomRepository.find();
    const sortedRooms = allRooms.sort((a, b) => a.title.localeCompare(b.title));
    return sortedRooms;
  }

  async get(roomId: string): Promise<Room | undefined> {
    const room = await this.roomRepository.findOneBy({
      id: roomId,
    });
    return room;
  }
}
