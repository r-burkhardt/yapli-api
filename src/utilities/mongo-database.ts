import {MongoClient} from 'mongodb';


interface DatabaseConfig {
  host: string;
  port: string;
  database: string;
  user: string;
  password: string;
}

/**
 * Mongo Database Client
 */
export class MongoDatabase {
  private client: MongoClient | undefined;

  /**
   * //
   * @param {DatabaseConfig} config
   */
  constructor (
      private readonly config: DatabaseConfig
      // private readonly connectionString: string,
      // private readonly portNumber: string,
      // private readonly dbName: string
  ) {}

  /**
   * //
   * @returns {Promise<void>}
   */
  async connect () {
    try {
      if (!this.client) {
        console.info(`Connecting to ${this.config.database}`);
        this.client = await MongoClient.connect(`mongodb://${this.config.host}:${this.config.port}`, {'useNewUrlParser': true});
      } else {
        console.info(`Connection to ${this.config.host} exists.`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * //
   */
  close () {
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
      console.info(`getting db ${this.config.database}`);

      return this.client.db(this.config.database);
    } else {
      console.error('no db found');

      return undefined;
    }
  }


}
