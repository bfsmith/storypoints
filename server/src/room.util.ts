import { Room, RoomDetails } from './models';
import { UserService } from './user.service';

export async function toRoomDetails(
  userService: UserService,
  room: Room,
): Promise<RoomDetails> {
  const roomDetails: RoomDetails = {
    ...room,
    members: (
      await Promise.all(
        room.members.map((userId) => userService.getById(userId)),
      )
    ).filter((_) => !!_),
  };
  return roomDetails;
}

export async function toRoom(room: RoomDetails): Promise<Room> {
  const roomDetails: Room = {
    ...room,
    members: room.members.map((m) => m.id),
  };
  return roomDetails;
}
