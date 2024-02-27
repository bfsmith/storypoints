import { Room } from './room';

export interface RoomMessage {
  room: Room;
}

export interface RoomActionMessage {
  room: string;
  userId: string;
}

export interface JoinRoomMessage extends RoomActionMessage {
  userName: string;
}

export interface ClearVotesRoomMessage extends RoomActionMessage {
}

export interface ShowVotesRoomMessage extends RoomActionMessage {
  show: boolean;
}

export interface VoteMessage {
  room: string;
  userId: string;
  vote: number | undefined;
}

export interface ServerToClientEvents {
  room: (message: RoomMessage) => void;
}

export interface ClientToServerEvents {
  join: (message: JoinRoomMessage) => void;
  vote: (message: VoteMessage) => void;
  clearVotes: (message: ClearVotesRoomMessage) => void;
  show: (message: ShowVotesRoomMessage) => void;
}
