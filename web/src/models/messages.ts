import { Room } from './room';

export interface RoomMessage {
  room: Room;
}

export interface RoomActionMessage {
  room: string;
  user: string;
}

export interface JoinRoomMessage extends RoomActionMessage {
}

export interface ClearVotesRoomMessage extends RoomActionMessage {
}

export interface ShowVotesRoomMessage extends RoomActionMessage {
  show: boolean;
}

export interface VoteMessage {
  room: string;
  user: string;
  points: number | undefined;
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
