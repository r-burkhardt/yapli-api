import {Request, Response} from 'express';
import {MongoDatabase} from '../utilities/mongo-database';
import {
  InsertOneWriteOpResult,
  MongoError,
  ObjectID,
  UpdateWriteOpResult,
} from 'mongodb';
import * as httpStatus from 'http-status-codes';
import {YSellersConfig} from '../enviroment';
import {SellerObj} from '../interfaces/seller-obj';
import {
  decodeTimeStamp,
  createTimeStamp,
} from '../utilities/date-time';


export class SellerController {
  mongo = new MongoDatabase(YSellersConfig);
  readonly CollectionName = 'ys_seller';

  getSeller = async (req: Request, res: Response) => {
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
                msg: 'An error has occurred while trying to find the seller'
              });
        }

        if (document) {
          res.status(httpStatus.OK)
              .json({
                success: true,
                msg: 'SellerController Found!',
                data: document
              });
        } else {
          res.status(httpStatus.NO_CONTENT)
              .json({
                success: false,
                msg: 'SellerController Not Found!'
              });
        }
      });
    });
  }

  postSeller = async (req: Request, res: Response) => {
    res.type('application/json');

    const seller = req.body;

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

      collection.insertOne(seller, (err: MongoError, document: InsertOneWriteOpResult<any>) => {
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
                seller_id: document['ops'][0]._id
              }
            });
      });
    });

    this.mongo.close();
  }

  putSeller = async (req: Request, res: Response) => {
    res.type('application/json');

    const sellerId = {_id: new ObjectID(req.params.id)};
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

      collection.updateOne(
          sellerId,
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
                    msg: 'SellerController does not exist!'
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
                    msg: 'SellerController updated!',
                  });
            }
          });
    });

    this.mongo.close();
  }

  deleteSeller = async (req: Request, res: Response) => {
    res.type('application/json');

    res.status(400).json({msg: 'Not implemented'});
  }

  private validateSeller(): boolean {
    return true;
  }
}
