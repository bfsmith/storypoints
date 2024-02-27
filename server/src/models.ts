import { Column, Entity, PrimaryColumn } from 'typeorm';

export interface UserVotes {
  userId: string;
  vote: number;
}

export interface User {
  /** UUID */
  id: string;
  name: string;
}

@Entity()
export class Room {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column('simple-array')
  pointOptions: number[];

  @Column('simple-array')
  members: string[];

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('simple-json')
  votes: UserVotes[];

  @Column()
  areVotesVisible: boolean;
}

export interface RoomDetails extends Omit<Room, 'members'> {
  members: User[];
}

export interface RoomMessage {
  room: RoomDetails;
}

export interface RoomActionMessage {
  room: string;
  userId: string;
}

export interface JoinRoomMessage extends RoomActionMessage {
  userName: string;
}

export interface ClearVotesRoomMessage extends RoomActionMessage {}

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
