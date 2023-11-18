export interface UserVotes {
  user: string;
  points: number;
}

export interface Room {
  id: string;
  name: string;
  pointOptions: number[];
  members: string[];
  title: string;
  description: string;
  votes: UserVotes[];
  areVotesVisible: boolean;
}

