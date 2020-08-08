import {Request, Response} from 'express';
import {MongoDatabase} from '../utilities/mongo-database';
import {MongoError, ObjectID, UpdateWriteOpResult} from 'mongodb';
import * as httpStatus from 'http-status-codes';
import {YProductsConfig} from '../enviroment';
import {YapliStockNumber} from '../utilities/yapli-stock-number';
import {ProductObj} from '../interfaces/product-obj';


const YSN = new YapliStockNumber();

export class Product {
  mongo = new MongoDatabase(YProductsConfig);
  readonly CollectionName = 'yp_product';
  readonly SellerIdForTesting = '11eaa404-569a-e3b4-b285-609ae09857ed';

  getProduct = async (req: Request, res: Response) => {
    res.type('application/json');

    const reqYSN = req.query.ysn;
    const reqID = req.query.id;
    // const reqSellerID = req.query.vid;
    // const reqPageNo =
    //     (req.query.pageno && req.query.pageno > 0) ?
    //         parseInt(req.query.pageno) : 0;
    // const reqPageSize =
    //     (req.query.pagesize && req.query.pagesize > 0) ?
    //         parseInt(req.query.pagesize) : 100;

    await this.mongo.connect();
    const db = this.mongo.attachDatabase();
    if (!db) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({
                  success: false,
                  msg: 'Error connecting to Database.'
                });
    }

    // if (!reqYSN && reqSellerID && !(new ObjectID(reqID))) {
    if (!reqYSN && !(new ObjectID(reqID))) {
      res.status(httpStatus.PRECONDITION_REQUIRED)
          .json({
            success: false,
            msg: 'No YSN or ID passed, please try again.'
          });
      return;
    }

    // @ts-ignore
    db.collection(this.CollectionName, (error: MongoError, collection: any) => {
      if (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({
              success: false,
              msg: `An error occurred accessing collection ${this.CollectionName}`,
              error: error
            });
      }

      // if (reqSellerID) {
      //   /**
      //    * Handle the return of all products for a seller by ID.
      //    */
      //   collection.find({user_id: reqSellerID})
      //       .skip(reqPageSize * (reqPageNo - 1))
      //       .limit(reqPageSize)
      //       .toArray((err: MongoError, documents: any) => {
      //         if (err) {
      //           res.status(httpStatus.BAD_REQUEST)
      //               .json({
      //                   success: false,
      //                   msg: 'An error has occurred while trying to find the products'
      //               });
      //         }
      //
      //         if (documents) {
      //           res.status(httpStatus.OK)
      //               .json({
      //                 success: true,
      //                 msg: 'Product Found!',
      //                 product: documents
      //               });
      //         } else {
      //           res.status(httpStatus.NO_CONTENT)
      //               .json({
      //                 success: false,
      //                 msg: 'Product Not Found!',
      //                 product: documents
      //               });
      //         }
      //       });
      // } else {
        /**
         * Handles the lookup and return of a single product by YSN or _id
         */
        const filter = (reqYSN) ? {ysn: reqYSN} : {_id: new ObjectID(reqID)};
        collection.findOne(filter, (err: MongoError, document: any) => {
          if (err) {
            res.status(httpStatus.BAD_REQUEST)
                .json({
                  success: false,
                  msg: 'An error has occurred while trying to find the product',
                  error: err
                });
          }

          if (document) {
            res.status(httpStatus.OK)
                .json({
                  success: true,
                  msg: 'Product Found!',
                  data: document
                });
          } else {
            res.status(httpStatus.NO_CONTENT)
                .json({
                  success: false,
                  msg: 'Product Not Found!'
                });
          }
        });
      // }
    });

    this.mongo.close();
  };

  postProduct = async (req: Request, res: Response) => {
    res.type('application/json');

    const product = req.body;
    if (!product.upc_code || !product.ean_jan || !product.isbn) {
      res.status(httpStatus.PRECONDITION_REQUIRED)
          .json({
            success: false,
            msg: 'UPC missing, UPC required or apply for product variance.'
          });
      return;
    }

    const newYsn = await YSN.getYapliStockNumbers();
    product.ysn = newYsn[0];

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
              msg: `An error has occurred while trying to find the product collection`
            });
        return;
      }

      collection.insertOne(product, (err: MongoError, document: any) => {
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

    this.mongo.close();
  };

  putProduct = async (req: Request, res: Response) => {
    res.type('application/json');

    const productId = {_id: new ObjectID(req.params.id)};
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
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({
              success: false,
              msg: `An error occurred accessing collection ${this.CollectionName}`,
              error: error
            });
        return;
      }

      collection.updateOne(
          productId,
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
                    msg: 'Product does not exist!'
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
                    msg: 'Product updated!',
                  });
            }
          });
    });
  };

  deleteProduct = (req: Request, res: Response) => {
    res.type('application/json');

    res.status(400).json({msg: 'Not implemented'});
  };

  private validateNewProduct(): boolean {
    return true;
  }

  private async checkForVariance(mpn: string): Promise<boolean> {
    // const collectionName = 'yp_product_variance'
    // await this.mongo.connect();
    // const db = this.mongo.attachDatabase();
    // if (!db) {
    //   // res.status(httpStatus.INTERNAL_SERVER_ERROR)
    //   //     .json({
    //   //             success: false,
    //   //             msg: 'Error connecting to Database.'
    //   //           });
    //   return false;
    // }
    //
    // db.collection(this.CollectionName, (error: MongoError, collection: any) => {
    //   if (error) {
    //     return false;
    //   }
    //
    //   collection.findOne();
    //
    //   return true;
    // });


    return false;
  }

}
