import {Request, Response} from 'express';
import {MongoDatabase} from '../utilities/mongo-database';
import {MongoError, ObjectID, UpdateWriteOpResult} from 'mongodb';
import * as httpStatus from 'http-status-codes';
import {YProductsConfig} from '../enviroment';
import {ProductVarianceRequestStatuses} from '../interfaces/product-variance-request-obj';


export class ProductVarianceRequest {
  mongo = new MongoDatabase(YProductsConfig);
  readonly CollectionName = 'yp_product_variance';

  getProductVarianceRequest = async (req: Request, res: Response) => {
    res.type('application/json');

    const reqID = req.query.id;
    const reqSellerID = req.query.seller_id;
    const reqMPN = req.query.mpn;
    const reqStatus = req.query.status;
    const reqPageNo =
        (req.query.pageno && req.query.pageno > 0) ?
            parseInt(req.query.pageno) : 1;
    const reqPageSize =
        (req.query.pagesize && req.query.pagesize > 0) ?
            parseInt(req.query.pagesize) : 100;


    if (!reqID && !(reqSellerID && reqMPN) && (!reqStatus || !Object.values(ProductVarianceRequestStatuses).includes(reqStatus))) {
      res.status(httpStatus.PRECONDITION_REQUIRED)
          .json({
            success: false,
            msg: 'Missing required parameters.'
          });
      return;
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

    db.collection(this.CollectionName, async (error: MongoError, collection: any) => {
      if (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({
              success: false,
              msg: `An error occurred accessing collection ${this.CollectionName}`,
              error: error
            });
        return;
      }

      if (reqID) {
        /**
         * Get product variance request by id.
         */
        const filter = {_id: new ObjectID(reqID)};

        collection.find(filter, (err: MongoError, document: any) => {
          if (err) {
            res.status(httpStatus.BAD_REQUEST)
                .json({
                  success: false,
                  msg: `An error has occurred while trying to find the product variance`,
                  error: err
                });
          }

          if (document) {
            res.status(httpStatus.OK)
                .json({
                  success: true,
                  msg: 'ProductController variance Found!',
                  data: document
                });
          } else {
            res.status(httpStatus.NO_CONTENT)
                .json({
                  success: false,
                  msg: 'ProductController variance Not Found!'
                });
          }
        });
      } else if (reqSellerID && reqMPN) {
        /**
         * Get a product variance request by seller id and mpn.
         */
        const filter = {seller_id: reqSellerID, mpn: reqMPN};

        collection.find(filter, (err: MongoError, document: any) => {
          if (err) {
            res.status(httpStatus.BAD_REQUEST)
                .json({
                  success: false,
                  msg: `An error has occurred while trying to find the product variance`,
                  error: err
                });
          }

          if (document) {
            res.status(httpStatus.OK)
                .json({
                  success: true,
                  msg: 'ProductController variance Found!',
                  data: document
                });
          } else {
            res.status(httpStatus.NO_CONTENT)
                .json({
                  success: false,
                  msg: 'ProductController variance Not Found!'
                });
          }
        });
      } else if (reqSellerID) {
        /**
         * Get all product varience request for the requested seller id.
         */
        const filter = {seller_id: reqSellerID};

        collection.find(filter)
            .skip(reqPageSize * (reqPageNo - 1))
            .limit(reqPageSize)
            .toArray((err: MongoError, documents: any) => {
          if (err) {
            res.status(httpStatus.BAD_REQUEST)
                .json({
                  success: false,
                  msg: `An error has occurred while trying to find the product variance`,
                  error: err
                });
          }

          if (documents) {
            res.status(httpStatus.OK)
                .json({
                  success: true,
                  msg: `Product variances for ${reqSellerID} Found!`,
                  count: 0,
                  data: documents
                });
          } else {
            res.status(httpStatus.NO_CONTENT)
                .json({
                  success: false,
                  msg: `No product variances for ${reqSellerID} Found!`
                });
          }
        });
      } else if (reqStatus) {
        /**
         * Get product variances requests by status.
         */
        const filter = {status: reqStatus};

        let documentCount = 0;
        await collection.countDocuments({$expr: { $eq: ["$status", filter.status] }}, (error: MongoError, docCount: number) => {
          documentCount = docCount;
        });

        // collection.find(filter)
        //     .skip(reqPageSize * (reqPageNo - 1))
        //     .limit(reqPageSize)
        //     .toArray((err: MongoError, documents: any) => {
        collection.find(filter, {skip: (reqPageSize * (reqPageNo - 1)), limit: reqPageSize}, (err: MongoError, documents: any) => {
          if (err) {
            res.status(httpStatus.BAD_REQUEST)
                .json({
                  success: false,
                  msg: `An error has occurred while trying to find the product variance`,
                  error: err
                });
          }

          if (documents) {
            res.status(httpStatus.OK)
                .json({
                  success: true,
                  msg: `Product variances with ${reqStatus} status!`,
                  page: reqPageNo,
                  totalPages:
                      (documentCount > reqPageSize) ? documentCount/reqPageSize : 1,
                  count: documentCount,
                  data: documents
                });
          } else {
            res.status(httpStatus.NO_CONTENT)
                .json({
                  success: false,
                  msg: `No product variances with ${reqStatus} status found!`
                });
          }
        });
      }
    });
  }

  postProductVarianceRequest = async (req: Request, res: Response) => {
    res.type('application/json');

    const productVariance = req.body;
    if (!productVariance.mpn) {
      res.status(httpStatus.PRECONDITION_REQUIRED)
          .json({
            success: false,
            msg: 'MPN is required to submit a product variance request.'
          });
      return;
    }
    productVariance['status'] = ProductVarianceRequestStatuses.OPEN;

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
        return;
      }

      collection.insertOne(productVariance, (err: MongoError, document: any) =>{
        if (err) {
          res.status(httpStatus.BAD_REQUEST)
              .json({
                success: false,
                msg: 'An error occurred during insert'
              });
          return;
        }

        res.status(httpStatus.OK)
            .json({
              success: true,
              msg: 'Insertion was successful',
              data: document['ops'][0]
            });
      });
    });

    this.mongo.close();
  }

  putProductVarianceRequest = async (req: Request, res: Response) => {
    res.type('application/json');

    const pvrID = {_id: new ObjectID(req.params.id)};
    const updateDoc = req.body;
    // if (!productVariance.mpn) {
    //   res.status(httpStatus.PRECONDITION_REQUIRED)
    //       .json({
    //               success: false,
    //               msg: 'MPN is required to submit a product variance request.'
    //             });
    //   return;
    // }

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
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({
              success: false,
              msg: `An error occurred accessing collection ${this.CollectionName}`,
              error: error
            });
        return;
      }

      collection.updateOne(
          pvrID,
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
                    msg: 'ProductController variance request does not exist!'
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
                    msg: 'ProductController variance request updated!',
                  });
            }
          });
    });
  }

  deleteProductVarianceRequest = (req: Request, res: Response) => {
    res.type('application/json');

    const reqID = req.params.id;

    res.status(400).json({msg: 'Not implemented'});
  }
}
