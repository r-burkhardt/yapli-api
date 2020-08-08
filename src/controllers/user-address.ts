import {Request, Response} from 'express';
import {MongoDatabase} from '../utilities/mongo-database';
import {MongoError, ObjectID, UpdateWriteOpResult} from 'mongodb';
import * as httpStatus from 'http-status-codes';
import {YUsersConfig} from '../enviroment';


export class UserAddress {
  mongo = new MongoDatabase(YUsersConfig);
  readonly CollectionName = 'yu_user_address';

  getUserAddress = async (req: Request, res: Response) => {
    res.type('application/json');

    const userAddressID = {_id: new ObjectID(req.query.id)};
    const userID = req.query.user_id;

    if (!userAddressID && !userID) {
      res.status(httpStatus.PRECONDITION_REQUIRED)
          .json({
            success: false,
            msg: 'Missing required query parameters, review documentation.'
          });
    }

    await this.mongo.connect();
    const db = this.mongo.attachDatabase();
    if (!db) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({
            success: false,
            msg: 'Error connecting to Database.'
          });
      return;
    }

    db.collection(this.CollectionName, (error: MongoError, collection: any) => {
      if (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({
              success: false,
              msg: `An error occurred accessing collection ${this.CollectionName}`,
              error: error
            });
      }

      if (userID) {
        collection.find({user_id: userID}).toArray((err: MongoError, documents: any) => {
          if (err) {
            res.status(httpStatus.BAD_REQUEST)
                .json({
                  success: false,
                  msg: 'An error has occurred while trying to find the addresses'
                });
          }

          if (documents) {
            res.status(httpStatus.OK)
                .json({
                  success: true,
                  msg: 'Addresses Found!',
                  data: documents
                });
          } else {
            res.status(httpStatus.NO_CONTENT)
                .json({
                  success: false,
                  msg: 'Addresses Not Found!'
                });
          }
        });
      } else {
        collection.findOne(userAddressID, (err: MongoError, document: any) => {
          if (err) {
            res.status(httpStatus.BAD_REQUEST)
                .json({
                  success: false,
                  msg: 'An error has occurred while trying to find the address',
                  error: err
                });
          }

          if (document) {
            res.status(httpStatus.OK)
                .json({
                  success: true,
                  msg: 'Address Found!',
                  data: document
                });
          } else {
            res.status(httpStatus.NO_CONTENT)
                .json({
                  success: false,
                  msg: 'Address Not Found!'
                });
          }
        });
      }
    });
  }

  postUserAddress = async (req: Request, res: Response) => {
    res.type('application/json');

    const userAddress = req.body;

    await this.mongo.connect();
    const db = this.mongo.attachDatabase();
    if (!db) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({
            success: false,
            msg: 'Error connecting to Database.'
          });
      return;
    }

    db.collection(this.CollectionName, (error: MongoError, collection: any) => {
      if (error) {
        res.status(httpStatus.BAD_REQUEST)
            .json({
              success: false,
              msg: `An error has occurred while trying to find the user address collection`
            });
        return;
      }

      collection.insertOne(userAddress, (err: MongoError, document: any) => {
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
              data: document['ops'][0]
            });
      });
    });
  }

  putUserAddress = async (req: Request, res: Response) => {
    res.type('application/json');

    const userAddressID = {_id: new ObjectID(req.params.id)};
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
      return;
    }

    db.collection(this.CollectionName, (error: MongoError, collection: any) => {
      if (error) {
        res.status(httpStatus.BAD_REQUEST)
            .json({
              success: false,
              msg: `An error has occurred while trying to access collection.`,
            });
      }

      collection.updateOne(
          userAddressID,
          {$set: updateDoc},
          (err: MongoError, result: UpdateWriteOpResult) => {
            console.log(result);
            if (err) {
              res.status(httpStatus.BAD_REQUEST)
                  .json({
                    success: false,
                    msg: 'An error has occurred during update.',
                    error: err
                  });
            } else if (!result.matchedCount) {
              res.status(httpStatus.NOT_FOUND)
                  .json({
                    success: false,
                    msg: 'User address does not exist!'
                  });
            } else if (!result.modifiedCount) {
              res.status(httpStatus.NOT_MODIFIED)
                  .json({
                    success: false,
                    msg: 'No changes were made!'
                  });
            } else {
              res.status(httpStatus.ACCEPTED)
                  .json({
                    success: true,
                    msg: 'User address updated!',
                  });
            }
          });
    });
  }

  deleteUserAddress = async (req: Request, res: Response) => {
    res.type('application/json');

    const reqUAID = {_id: new ObjectID(req.params.id)};

    await this.mongo.connect();
    const db = this.mongo.attachDatabase();
    if (!db) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({
                  success: false,
                  msg: 'Error connecting to Database.'
                });
      return;
    }

    db.collection(this.CollectionName, (error: MongoError, collection: any) => {
      if (error) {
        res.status(httpStatus.BAD_REQUEST)
            .json({
              success: false,
              msg: `An error has occurred while trying to access collection.`,
            });
      }

      collection.deleteOne(reqUAID, (err: MongoError, result: any) => {
        if (err) {
          res.status(httpStatus.BAD_REQUEST)
              .json({
                success: false,
                msg: 'An error has occurred during deletion.',
                error: err
              });
        } else {
          if (!result['deletedCount']) {
            res.status(httpStatus.ACCEPTED)
                .json({
                  success: true,
                  msg: 'Address deleted!',
                });
          } else {
            res.status(httpStatus.NOT_MODIFIED)
                .json({
                  success: true,
                  msg: 'Nothing deleted!',
                });
          }
        }
      });
    });
  }
}
