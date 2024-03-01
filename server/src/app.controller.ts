import { Room, RoomDetails } from './models';
import { RoomService } from './room.service';
import { toRoomDetails } from './room.util';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';

export interface RoomCreateOptions
  extends Omit<Room, 'id' | 'members' | 'votes' | 'areVotesVisible'> {
  id?: string;
}

@Controller('/api/rooms')
export class AppController {
  constructor(
    private readonly roomService: RoomService,
    private readonly userService: UserService,
  ) {}

  @Get('')
  public async listRooms(): Promise<Room[]> {
    const rooms = await this.roomService.list();
    console.log('returning rooms', rooms);
    return rooms;
  }

  @Get('/:roomId')
  public async getRoom(
    @Param('roomId') roomId: string,
  ): Promise<RoomDetails | undefined> {
    const room = await this.roomService.get(roomId);
    console.log('returning room', roomId, room);

    if (!room) {
      throw new NotFoundException();
    }

    const roomDetails = await toRoomDetails(this.userService, room);
    return roomDetails;
  }

  @Post()
  public async createRoom(
    @Body() createOptions: RoomCreateOptions,
  ): Promise<Room> {
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
