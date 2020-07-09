// import {createPool,  Pool} from 'mysql';
// import {DBConfig} from '../enviroment';
//
// interface DatabaseConfig {
//   connectionLimit?: 100;
//   host: string;
//   user: string;
//   password: string;
//   database: string;
// }
//
// export class MongoDatabase {
//   connect = async (): Promise<Pool> => {
//     const connection = await createPool(DBConfig);
//     return connection;
//   }
// }

import {Db, MongoClient} from 'mongodb';


export class MongoDatabase {
  private client: MongoClient | undefined;

  constructor (
      private readonly connectionString: string,
      private readonly portNumber: string,
      private readonly dbName: string
  ) {}

  async connect() {
    try {
      if (!this.client) {
        console.info(`Connectiong to ${this.connectionString}`);
        this.client = await MongoClient.connect(`mongodb://${this.connectionString}:${this.portNumber}`, {'useNewUrlParser': true});
      } else {
        console.info(`Connection to ${this.connectionString} exists.`);
      }
    } catch(error) {
      console.error(error);
    }
  }

  close() {
    if (this.client) {
      this.client.close()
          .then()
          .catch(error => {
            console.error(error);
          });
    } else {
      console.error('close: client is undefined');
    }
  }

  attachDatabase() {
    if (this.client) {
      console.info(`getting db ${this.dbName}`);

      return this.client.db(this.dbName);
    } else {
      console.error('no db found');

      return undefined;
    }
  }


}
