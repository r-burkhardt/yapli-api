import {Request, Response} from 'express';
import {MongoDatabase} from '../utilities/mongo-database';
import {YapliStockNumber} from '../utilities/yapli-stock-number';
import {YProductsConfig} from '../enviroment';
import {Db, MongoError, ObjectID, UpdateWriteOpResult} from 'mongodb';
import * as httpStatus from 'http-status-codes';
import {ProductObj} from '../interfaces/product-obj';


const YSN = new YapliStockNumber();

export class Product {
  mongo = new MongoDatabase(YProductsConfig.host, YProductsConfig.port, YProductsConfig.database);
  readonly CollectionName = 'yp_product';
  readonly vendorIdForTesting = '11eaa404-569a-e3b4-b285-609ae09857ed';

  getProduct = async (req: Request, res: Response) => {
    res.type('application/json');

    const reqYSN = req.query.ysn;
    const reqID = req.query.id;
    const reqVendorID = req.query.vid;
    const reqPageNo =
        (req.query.pageno && req.query.pageno > 0) ?
            parseInt(req.query.pageno) : 0;
    const reqPageSize =
        (req.query.pagesize && req.query.pagesize > 0) ?
            parseInt(req.query.pagesize) : 100;

    await this.mongo.connect();
    const db: Db | undefined = this.mongo.attachDatabase();

    if (!reqYSN && reqVendorID && !(new ObjectID(reqID))) {
      res.status(httpStatus.PRECONDITION_REQUIRED)
          .json({
            success: false,
            message: 'No YSN or ID passed, please try again.'
          });
      return;
    }
    if (!db) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({
            success: false,
            message: 'Error connecting to Database.'
          });
    }

    // @ts-ignore
    db.collection(this.CollectionName, (error: MongoError, collection: any) => {
      if (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({
              success: false,
              message: `An error occurred accessing collection ${this.CollectionName}`
            });
      }

      if (reqVendorID) {
        /**
         * Handle the return of all products for a vendor by ID.
         */
        collection.find({user_id: reqVendorID})
            .skip(reqPageSize * (reqPageNo))
            .limit(reqPageSize)
            .toArray((err: MongoError, documents: any) => {
              if (err) {
                res.status(httpStatus.BAD_REQUEST);
                res.json({
                  success: false,
                  msg: 'An error has occurred while trying to find the products'
                });
              }

              if (documents) {
                res.status(httpStatus.OK);
                res.json({
                  success: true,
                  msg: 'Product Found!',
                  product: documents
                });
              } else {
                res.status(httpStatus.NO_CONTENT);
                res.json({
                  success: false,
                  msg: 'Product Not Found!',
                  product: documents
                         });
              }
            });
      } else {
        /**
         * Handles the lookup and return of a single product by YSN or _id
         */
        const filter = (reqYSN) ? {ysn: reqYSN} : {_id: new ObjectID(reqID)};
        collection.findOne(filter, (err: MongoError, document: any) => {
          if (err) {
            res.status(httpStatus.BAD_REQUEST);
            res.json({
              success: false,
              msg: 'An error has occurred while trying to find the product'
            });
          }

          if (document) {
            res.status(httpStatus.OK);
            res.json({
                       success: true,
                       msg: 'Product Found!',
                       product: document
                     });
          } else {
            res.status(httpStatus.NO_CONTENT);
            res.json({
              success: false,
              msg: 'Product Not Found!',
              product: document
            });
          }
        });
      }
    });
    // ((err: MysqlError, connection: PoolConnection) =>{
    //   connection.query(
    //     `SELECT * FROM ppb_listings WHERE id = ${reqYSN};`,
    //     (err: MysqlError | null, rows, fields: string[]) => {
    //       if (err) {
    //         res.status(500)
    //             .json({
    //               success: false,
    //               message: err
    //             });
    //         return;
    //       }
    //       res.status(200);
    //       if (rows[0]) {
    //         res.json({
    //           success: true,
    //           listing: rows[0]
    //         });
    //       } else {
    //         res.json({
    //           success: false,
    //           message: 'Product not found'
    //         });
    //       }
    //     }
    //   );
    // });
  };

  postProduct = async (req: Request, res: Response) => {
    res.type('application/json');

    const newYsn = await YSN.getYapliStockNumbers();
    const listing = req.body;
    listing.ysn = newYsn[0];

    await this.mongo.connect();
    const db = this.mongo.attachDatabase();

    if (!db) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({
            success: false,
            message: 'Error connecting to Database.'
          });
      return;
    }

    db.collection(this.CollectionName, (err: MongoError, collection: any) => {
      if (err) {
        res.status(httpStatus.BAD_REQUEST)
            .json({
              success: false,
              msg: 'An error has occurred while trying to find the product'
            });
        return;
      }

      collection.insertOne(listing, (err: MongoError, document: any) => {
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
              product: document['ops'][0]
            });
      });
    });
    // } else {
    //   res.json({'msg': 'could not connect to db'});
    //   res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    // }

    // listing.user_id = listing.user_id.replace(/-/g, '');
    // const listingKeys = Object.keys(listing);
    // const listingValues = Object.values(listing);
    // console.log(listingKeys);
    // console.log(listingValues);
    // const conn = await this.mongo.connect();
    // const newUserId = await conn.query('SELECT UUID_TO_BIN(listing.user_id)');
    // console.log(newUserId);

    // const getIdResult = await this.getUserID(userIdForTesting, conn);
    // console.log(getIdResult);

    // conn.getConnection(async (err: MysqlError, connection: PoolConnection) => {
    //   const callSql = `SELECT UUID_TO_BIN( ? , 1)`;
    //   await connection.query(callSql, listing.user_id, (err: any, result: any) => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       listing.user_id = Object.values(result[0])[0];
    //       result[0][Object.keys(result[0])[0]]
    //       console.log(listing.user_id);
        // }
      // });
      // const insertString = InsertQueryBuilder('ppb_listings', listing, ['user_id']);
      // const insertString = InsertQueryBuilder('ppb_listings', listing);
      // console.log(insertString);

      // await connection.query(
      //     `Insert INTO ppb_listings VALUES ?`,
      //     listing,
      //     (err: any, result: any) => {
      //       if (err) {
      //         console.log(err);
      //         res.status(500).json({
      //           success: 'error',
      //           message: err,
      //         });
      //         return;
      //       }
      //       res.status(200).json({
      //         success: true,
      //         listings: result,
      //       });
      //     });
    // });
    // res.status(200).json({});
  };

  putProduct = async (req: Request, res: Response) => {
    res.type('application/json');
    const productId = { '_id': new ObjectID(req.params.id) };
    const updateDoc = req.body;

    if (updateDoc._id) delete updateDoc._id;

    await this.mongo.connect();
    const db = this.mongo.attachDatabase();

    if (!db) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({
            success: false,
            message: 'Error connecting to Database.'
          });
      return;
    }

    db.collection(this.CollectionName, (err: MongoError, collection: any) => {
      if (err) {
        res.status(httpStatus.BAD_REQUEST)
            .json({
              success: false,
              msg: `An error has occurred while trying to access collection.`,
            });
      }

      collection.updateOne(
          productId,
          {$set: updateDoc},
          (error: MongoError, result: UpdateWriteOpResult) => {
            if (err) {
              res.status(httpStatus.BAD_REQUEST);
              res.json({
                 success: false,
                 msg: 'An error has occurred during update.',
                 error: err
               });
            } else if (result.matchedCount === 0) {
              res.status(httpStatus.NOT_FOUND);
              res.json({
                success: false,
                msg: 'Product does not exist!'
              });
            } else if (result.modifiedCount === 0) {
              res.status(httpStatus.NOT_MODIFIED);
              res.json({
                success: false,
                msg: 'No changes were made!'
             });
            } else {
              res.status(httpStatus.ACCEPTED);
              res.json({
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

}
