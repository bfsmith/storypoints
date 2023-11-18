import { Injectable } from '@nestjs/common';
import { Room, User } from './models';

@Injectable()
export class UserService {
  private readonly users: Record<string, User> = {};

  async set(socketId: string, user: User): Promise<void> {
    this.users[socketId] = user;
  }

  async get(socketId: string): Promise<User | undefined> {
    const user = this.users[socketId];
    return user;
  }

  async remove(socketId: string): Promise<void> {
    delete this.users[socketId];
  }
}
