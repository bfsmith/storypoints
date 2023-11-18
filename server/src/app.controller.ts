import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post
  } from '@nestjs/common';
import { Room } from './models';
import { RoomService } from './room.service';

export interface RoomCreateOptions
  extends Omit<Room, 'id' | 'members' | 'votes' | 'areVotesVisible'> {
  id?: string;
}

@Controller('/api/rooms')
export class AppController {
  constructor(private readonly roomService: RoomService) {}

  @Get('')
  public async listRooms(): Promise<Room[]> {
    const rooms = await this.roomService.list();
    console.log('returning rooms', rooms);
    return rooms;
  }

  @Get('/:roomId')
  public async getRoom(@Param('roomId') roomId: string): Promise<Room | undefined> {
    const room = await this.roomService.get(roomId);
    console.log('returning room', roomId, room);
    
    if (!room) {
      throw new NotFoundException();
    }
    
    return room; 
  }

  @Post() 
  public async createRoom(@Body() createOptions: RoomCreateOptions): Promise<Room> {
    console.log('create options', createOptions);
    const newRoom: Room = {
      ...createOptions,
      id: createOptions.id || 'test',
      members: [],
      votes: [],
      areVotesVisible: false,
    };
    this.roomService.create(newRoom);
    return newRoom;
  }
}
