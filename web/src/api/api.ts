import axios, { AxiosError } from 'axios';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../models/messages';
import { Room } from '../models/room';

const domain = import.meta.env.PROD ? window.location.host : 'localhost:3001';
const baseApiUrl = `${window.location.protocol}//${domain}`;
const baseSocketUrl = `ws://${domain}`;

export interface RoomCreateOptions
  extends Omit<Room, "id" | "members" | "votes" | "areVotesVisible"> {
  id?: string;
}

export async function getRoom(roomId: string): Promise<Room | undefined> {
  try {
    const resp = await axios.get<Room>(`${baseApiUrl}/api/rooms/${roomId}`);

    const room = resp.data;
    return room;
  } catch (e: any) {
    if (e.isAxiosError) {
      const err = e as AxiosError;
      if (err.response?.status != 404) {
        throw Error(e.message);
      }
      return undefined;
    }
    throw e;
  }
}

export async function createRoom(
  room: RoomCreateOptions
): Promise<Room> {
  try {
    const resp = await axios.post<Room>(`${baseApiUrl}/api/rooms`, room);
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
  const ws: RoomSocket = io(baseSocketUrl);
  return ws;
}
