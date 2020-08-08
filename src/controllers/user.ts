import {Request, Response} from 'express';
import {MongoDatabase} from '../utilities/mongo-database';
import {
  InsertOneWriteOpResult,
  MongoError,
  ObjectID,
  UpdateWriteOpResult,
} from 'mongodb';
import * as httpStatus from 'http-status-codes';
import {YUsersConfig} from '../enviroment';
import {UserObj} from '../interfaces/user-obj';
import {
  decodeTimeStamp,
  createTimeStamp,
  encodeDateOfBirth,
  decodeDateOfBirth,
} from '../utilities/date-time';


export class User {
  mongo = new MongoDatabase(YUsersConfig);
  readonly CollectionName = 'yu_user';

  getUser = async (req: Request, res: Response) => {
    res.type('application/json');

    const reqID = req.params.id;
    console.log('id', reqID);

    await this.mongo.connect();
    const db = this.mongo.attachDatabase();
    if (!db) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({
            success: false,
            msg: 'Error connecting to Database.'
          });
    }

    // @ts-ignore
    db.collection(this.CollectionName, (error: MongoError, collection) => {
      if (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({
              success: false,
              msg: `An error occurred accessing collection ${this.CollectionName}`
            });
      }

      collection.findOne({_id: new ObjectID(reqID)}, (err: MongoError, document:any) => {
        if (err) {
          res.status(httpStatus.BAD_REQUEST)
              .json({
                success: false,
                msg: 'An error has occurred while trying to find the user'
              });
        }

        if (document) {
          delete document.password;
          document.birthdate = decodeDateOfBirth(document.birthdate);

          res.status(httpStatus.OK)
              .json({
                success: true,
                msg: 'User Found!',
                data: document
              });
        } else {
          res.status(httpStatus.NO_CONTENT)
              .json({
                success: false,
                msg: 'User Not Found!'
              });
        }
      });
    });
  }

  postUser = async (req: Request, res: Response) => {
    res.type('application/json');

    const user = req.body;

    await this.mongo.connect();
    const db = this.mongo.attachDatabase();
    if (!db) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({
            success: false,
            msg: 'Error connecting to Database.'
          });
    }

    // @ts-ignore
    db.collection(this.CollectionName, (error: MongoError, collection: any) => {
      if (error) {
        res.status(httpStatus.BAD_REQUEST)
            .json({
              success: false,
              msg: 'An error has occurred while trying to find the product'
            });
        return;
      }

      user.birthdate = encodeDateOfBirth(user.birthdate);

      collection.insertOne(user, (err: MongoError, document: InsertOneWriteOpResult<any>) => {
        if (err) {
          res.status(httpStatus.BAD_REQUEST)
              .json({
                success: false,
                msg: 'An error occurred during insert'
              });
        }

        res.status(httpStatus.OK)
            .json({
              success: true,
              msg: 'Insertion was successful',
              data: {
                user_id: document['ops'][0]._id
              }
            });
      });
    });

    this.mongo.close();
  }

  putUser = async (req: Request, res: Response) => {
    res.type('application/json');

    const userId = {_id: new ObjectID(req.params.id)};
    const updateDoc = req.body;

    if (updateDoc._id) delete updateDoc._id;

    await this.mongo.connect();
    const db = this.mongo.attachDatabase();
    if (!db) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({
            success: false,
            msg: 'Error connecting to Database.'
          });
    }

    // @ts-ignore
    db.collection(this.CollectionName, (error: MongoError, collection: any) => {
      if (error) {
        res.status(httpStatus.BAD_REQUEST)
            .json({
              success: false,
              msg: `An error has occurred while trying to access collection.`,
            });
      }

      updateDoc.updated_at = createTimeStamp();
      if (updateDoc.birthdate) {
        updateDoc.birthdate = encodeDateOfBirth(updateDoc.birthdate)
      }




      collection.updateOne(
          userId,
          {$set: updateDoc},
          (err: MongoError, result: UpdateWriteOpResult) => {
            if (err) {
              res.status(httpStatus.BAD_REQUEST)
                  .json({
                    success: false,
                    msg: 'An error has occurred during update.',
                    error: err
                  });
            } else if (result.matchedCount === 0) {
              res.status(httpStatus.NOT_FOUND)
                  .json({
                    success: false,
                    msg: 'User does not exist!'
                  });
            } else if (result.modifiedCount === 0) {
              res.status(httpStatus.NOT_MODIFIED)
                  .json({
                    success: false,
                    msg: 'No changes were made!'
                  });
            } else {
              res.status(httpStatus.ACCEPTED)
                  .json({
                    success: true,
                    msg: 'User updated!',
                  });
            }
          });
    });

    this.mongo.close();
  }

  deleteUser = async (req: Request, res: Response) => {
    res.type('application/json');

    res.status(400).json({msg: 'Not implemented'});
  }

  private validateUser(): boolean {
    return true;
  }
}
