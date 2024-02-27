import { DataSource } from 'typeorm';
import typeormConfig from './typeorm.config';

const dataSource = new DataSource(typeormConfig); // config is one that is defined in datasource.config.ts file
dataSource.initialize();

export default dataSource;
