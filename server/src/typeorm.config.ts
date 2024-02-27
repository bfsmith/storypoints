import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import { Room } from './models';

const config: DataSourceOptions = {
  type: 'better-sqlite3',
  database: 'storypoints.db',
  entities: [Room],
  migrations: [join(__dirname, './migrations/*')],
};

export default config;
