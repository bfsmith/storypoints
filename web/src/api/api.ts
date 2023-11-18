import axios, { AxiosError } from 'axios';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../models/messages';
import { Room } from '../models/room';

export interface RoomCreateOptions
  extends Omit<Room, "id" | "members" | "votes" | "areVotesVisible"> {
  id?: string;
}

export async function getRoom(roomId: string): Promise<Room | undefined> {
  try {
    const resp = await axios.get<Room>(`http://localhost:3001/api/rooms/${roomId}`);

    const room = resp.data;
    return room;
  } catch (e: any) {
    if (e.isAxiosError) {
      const err = e as AxiosError;
      if (err.response?.status != 404) {
        throw Error(e.message);
      }

      const newRoom = await createRoom({
        id: roomId,
        name: "Test Room",
        description: "This is my test room",
        pointOptions: [1, 2, 3, 5, 8, 13, 21],
        title: "First thing to point",
      });
      return newRoom;
    }
  }
}

export async function createRoom(
  room: RoomCreateOptions
): Promise<Room | undefined> {
  try {
    const resp = await axios.post<Room>(`http://localhost:3001/api/rooms`, room);
 
    const createdRoom = resp.data;
    return createdRoom;
  } catch (e: any) {
    if (e.isAxiosError) {
      const err = e as AxiosError;
      throw Error(err.message);
    }
    throw e;
  }
}

export type RoomSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function webSocketConnect(): RoomSocket {
  const ws: RoomSocket = io("ws://localhost:3001");
  return ws;
}
