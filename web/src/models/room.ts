import { User } from './user';

export interface UserVotes {
  userId: string;
  vote: number;
}

export interface Room {
  id: string;
  name: string;
  pointOptions: number[];
  members: User[];
  title: string;
  description: string;
  votes: UserVotes[];
  areVotesVisible: boolean;
}

