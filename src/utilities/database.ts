import {createPool, Pool} from 'mysql';
import {DBConfig} from '../enviroment';

interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

export class Database {
  connect = async (): Promise<Pool> => {
    const connection = await createPool(DBConfig);
    return connection;
  }
}
