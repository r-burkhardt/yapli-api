import {Request, Response} from 'express';
import {MongoDatabase} from '../utilities/mongo-database';
import {MongoError, ObjectID, UpdateWriteOpResult} from 'mongodb';
import got from 'got';
import * as httpStatus from 'http-status-codes';
import {BarcodeLookupOptions, YProductsConfig} from '../enviroment';
import {YapliStockNumber} from '../utilities/yapli-stock-number';
import {YapliErrorCodes} from '../utilities/yapli-error-codes';
import {Product, ProductValidation} from '../models/product';
import {
  BarcodeLookupKeys, BLKeyToProductMatch,
  ProductCodeType, RequiredPCVerifyParams,
  TypeToField,
} from '../constants/product.constants';
import {ProcessMessage} from '../utilities/helpers';
import {APIResponse} from '../interfaces/types';


const YSN = new YapliStockNumber();

export class ProductController {
  mongo = new MongoDatabase(YProductsConfig);
  readonly CollectionName = 'yp_product';
  readonly SellerIdForTesting = '11eaa404-569a-e3b4-b285-609ae09857ed';

  getProduct = async (req: Request, res: Response) => {
    res.type('application/json');

    const reqYSN = req.query.ysn;
    const reqID = req.query.id;
    const reqSellerID = req.query.sid;
    const reqPageNo =
        (req.query.pageno && req.query.pageno > 0) ?
            parseInt(req.query.pageno) : 0;
    const reqPageSize =
        (req.query.pagesize && req.query.pagesize > 0) ?
            parseInt(req.query.pagesize) : 100;

    await this.mongo.connect();
    const db = this.mongo.attachDatabase();
    if (!db) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .json(Object.assign(
              {success: false},
              YapliErrorCodes.DATABASE_001
          ));
    }

    if (!reqYSN && reqSellerID && !reqID) {
    // if (!reqYSN && !reqID) {
      res.status(httpStatus.PRECONDITION_REQUIRED)
          .json(Object.assign(
                  {success: false},
                  YapliErrorCodes.PORDUCT_GET_001
          ));
      return;
    }

    db!.collection(this.CollectionName, (error: MongoError, collection: any) => {
      if (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({
              success: false,
              msg: `An error occurred accessing collection ${this.CollectionName}`,
              error: error
            });
      }

      if (reqSellerID) {
        /**
         * Handle the return of all products for a seller by ID.
         */
        collection.find({user_id: reqSellerID})
            .skip(reqPageSize * (reqPageNo - 1))
            .limit(reqPageSize)
            .toArray((err: MongoError, documents: any) => {
              if (err) {
                res.status(httpStatus.BAD_REQUEST)
                    .json({
                        success: false,
                        msg: 'An error has occurred while trying to find the products'
                    });
              }

              if (documents) {
                res.status(httpStatus.OK)
                    .json({
                      success: true,
                      msg: 'Product Found!',
                      product: documents
                    });
              } else {
                res.status(httpStatus.NO_CONTENT)
                    .json({
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
          console.log('line 107', document);
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
      }
    });

    this.mongo.close();
  };

  postProduct = async (req: Request, res: Response) => {
    res.type('application/json');

    const product = req.body;
    if (!product.upc && !product.ean_jan && !product.isbn) {
      res.status(httpStatus.PRECONDITION_REQUIRED)
          .json({
            success: false,
            msg: `Missing one of the following: UPC, EAN, JAN, ISBN required or apply for product variance.`
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
        res.status(httpStatus.BAD_REQUEST)
            .json({
              success: false,
              msg: `An error has occurred while trying to find the product collection`
            });
        return;
      }

      let filter = {};
      if (product.upc) {
        filter = {upc: product.upc, condition: product.condition};
      } else if (product.ean_jan) {
        filter = {ean_jan: product.ean_jan, condition: product.condition};
      } else if (product.isbn) {
        filter = {isbn: product.isbn, condition: product.condition};
      }
      collection.findOne(filter, async (err: MongoError, existingDocument: any) => {
        if (err) {
          res.status(httpStatus.BAD_REQUEST)
              .json({
                success: false,
                msg: `An error has occurred while trying to find the product variance`,
                error: err
              });
        }

        if (existingDocument) {
          res.status(httpStatus.OK)
              .json({
                success: false,
                msg: 'Document exists',
                data: existingDocument
              });
        } else {
          const newYsn = await YSN.getYapliStockNumbers();
          product.ysn = newYsn[0];

          console.log(product);

          collection.insertOne(product, (err: MongoError, document: any) => {
            if (err) {
              console.log(err);
              res.status(httpStatus.BAD_REQUEST)
                  .json({
                    success: false,
                    msg: 'An error occurred during insert'
                  });
              return;
            }

            console.log(document);
            res.status(httpStatus.OK)
                .json({
                  success: true,
                  msg: 'Insertion was successful',
                  data: document['ops'][0]
                });
          });
        }
      });
    });
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

  productCode = async  (req: Request, res: Response) => {
    res.type('application/json');

    let validation: ProductValidation;

    if (req.query.hasOwnProperty('verify') &&
        req.query.type &&
        req.query.code &&
        !isNaN(Number(req.query.code)) &&
        req.query.condition) {
      const type = req.query.type;
      const code = req.query.code;
      const condition = req.query.condition;

      await this.productCodeValidation(code, type, condition)
          .then((value) => {
            const status = value.status;
            delete value.status;
            console.log('return from productCodeValidation', status, value);
            res.status(status)
                .json(value);
          })
          .catch((err) => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({
                  success: false,
                  msg: 'Error occurred while processing validation--',
                  error: err
                });
          });
    } else {
      let message: string | string[] = '';
      for (const key of Object.keys(RequiredPCVerifyParams)) {
        const morphKey = key as keyof typeof RequiredPCVerifyParams;
        const param = RequiredPCVerifyParams[morphKey]
        if (param.func(req.query)) {
          message = ProcessMessage(message, param.msg);
        }
      }
      // if (!req.query.hasOwnProperty('verify')) {
      //   message = ProcessMessage(
      //       message,
      //       'Missing operation key, *verify*'
      //   );
      // }
      // if (!req.query.condition) {
      //   message = ProcessMessage(
      //       message,
      //       'Missing product condition, *new*, *renewed*, *used*, *opened*'
      //   );
      // }
      // if (!req.query.type) {
      //   message = ProcessMessage(
      //       message,
      //       'Missing product code type, *upc*, *ean*, *jan*, *isbn*'
      //   );
      // }
      // if (!req.query.code || isNaN(Number(req.query.code))) {
      //   message = ProcessMessage(
      //       message,
      //       `Missing product code, or code string contains non-numeric characters.`
      //   );
      // }
      res.status(httpStatus.PRECONDITION_REQUIRED)
          .json({
            success: false,
            msg: message,
          });
    }
  };

  private async getProductFromDatabase(): Promise<any> {
    return '';
  }

  private async getProductForSeller(
      sellerID: string,
      pageNo: number,
      pageSize: number
  ): Promise<any> {
    const response = {
      status: httpStatus.OK,
      success: true,
    }

    await this.mongo.connect();
    const db = this.mongo.attachDatabase();
    if (!db) {
      return Object.assign(
            response,
            {
              status: httpStatus.INTERNAL_SERVER_ERROR,
              success: false
            },
            YapliErrorCodes.DATABASE_001
          );
    }

    // @ts-ignore
    db.collection(this.CollectionName, (error: MongoError, collection: any) => {
      if (error) {
        return Object.assign(
            response,
            {
              status: httpStatus.INTERNAL_SERVER_ERROR,
              success: false,
              msg: `An error occurred accessing collection ${this.CollectionName}`,
              error: error
            }
        )
      }

      if (!new ObjectID(sellerID)) {
        return Object.assign(
            response,
            {
              status: httpStatus.BAD_REQUEST,
              success: false,
              msg: `Invalid seller id`
            }
        )
      }

      /**
       * Handle the return of all products for a seller by ID.
       */
      collection.find({user_id: sellerID})
          .skip(pageSize * (pageNo - 1))
          .limit(pageSize)
          .toArray((err: MongoError, documents: any) => {
            if (err) {
              return Object.assign(
                  response,
                  {
                    status: httpStatus.BAD_REQUEST,
                    success: false,
                    msg: `An error has occurred while trying to find the products`
                  }
              )
            }

            if (documents) {
              return Object.assign(
                  response,
                  {
                    status: httpStatus.OK,
                    success: true,
                    msg: 'Product Found!',
                    product: documents
                  }
              );
            } else {
              return Object.assign(
                  response,
                  {
                    status: httpStatus.NO_CONTENT,
                    success: false,
                    msg: 'No products Found!',
                  }
              );
            }
          });
    });
  }

  /**
   * /
   */
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

  /**
   * Product code validator, that returns if the product is validate and a
   * product if on exists in either the database already or in
   * BarcodeLookup.com.
   */
  private async productCodeValidation(
      code: string,
      type: string,
      condition: string
  ): Promise<any> {
    let product: any | any[];
    let bCLProduct: any;
    const validation =
        Product.validateProductCode(type, code);
    let response: APIResponse = {
      status: httpStatus.BAD_REQUEST,
      success: false,
    };

    if (validation.valid) {
      // Connect to database
      await this.mongo.connect();
      const db = this.mongo.attachDatabase();
      if (!db) {
        return Object.assign(
            {
              status: httpStatus.INTERNAL_SERVER_ERROR,
              success: false
            },
            YapliErrorCodes.DATABASE_001
        );
      }

      // Connects to database Collection
      // @ts-ignore
      // await db.collection(this.CollectionName, (error: MongoError, collection: any) => {
      //   if (error) {
      //     return Object.assign(
      //         {
      //           status: httpStatus.INTERNAL_SERVER_ERROR,
      //           success: false,
      //           msg: `An error occurred accessing collection ${this.CollectionName}`,
      //           error: error
      //         }
      //     );
      //   }
      //
      //   // Search database for existing product
      //   const searchField = `${TypeToField[type as keyof typeof TypeToField]}`;
      //   const filter = {[searchField]: code, condition: condition};
      //   // @ts-ignore
      //   collection.find(filter).toArray((err: MongoError, documents: any) => {
      //     if (err) {
      //       return Object.assign(
      //           response,
      //           {
      //             status: httpStatus.BAD_REQUEST,
      //             success: false,
      //             msg: 'An error has occurred while trying to find the product',
      //             error: err
      //           }
      //       );
      //     }
      //
      //
      //     // if (documents) {
      //     //   setTimeout(() => {
      //     //     product =
      //     //         documents.find((doc: Product) => doc.condition === condition);
      //     //     console.log('inside timeout', product);
      //     //   }, 1000);
      //     // }
      //     console.log('outside timeout', product);
      //   }).then(() => {
      //     console.log(product.name);
      //   });
      // });

      // If no product is returned from database, search barcodelookup.com
      // api for the product data.

      console.log('outside product', product, response);
      // @ts-ignore
      if (!product) {
        // search barcode database

        bCLProduct = await this.checkGS1BarcodeDB(code);
        if (bCLProduct.found) {
          delete bCLProduct.found;
          product = this.barcodeLookupToYapliProduct(bCLProduct)!;
        }
        console.log(product);
      }

      // Returns the status of the query along with the validation of the
      // product code and if there is a product will return the product also.
      // if (response.hasOwnProperty('success') && response.success)
      return Object.assign(
          response,
          {
            status: 200,
            success: true
          },
          validation,
          {product: product || undefined, return: 'hummm'}
      );
    } else {
      console.log('bCLProduct');
      // If product code is invalid, returns the status of the query
      // with the validation containing the validtion boolean and the
      // message of why it might be invalid.
      return Object.assign(
          {},
          {
            success: true,
          },
          validation
      );
    }
  }

  /**
   * Retrieves the product listing for the UPS from GS1 Barcode database if
   * it exists there.
   */
  private async checkGS1BarcodeDB(code: string): Promise<any> {
    const gotOptions = {
      searchParams: {
        barcode: code,
        formatted: 'y',
        key: BarcodeLookupOptions.KEY
      }
    };
    try {
      const response =
          await got(BarcodeLookupOptions.URL, gotOptions);
      const bCLProduct =  JSON.parse(response.body)
      return Object.assign({found: true}, bCLProduct.products[0]);
    } catch (err) {
      // console.error('GOT Error', err);
      // send to log, err should not be returned
      return {found: false, error: err};
    }

    // return Object.assign({found: true}, TestProduct.products[0]);
  }

  /**
   * Converts a GS1 product listing into a Yapli product.
   */
  private barcodeLookupToYapliProduct(bCLProduct: any): Product | undefined {
    if (!bCLProduct) return;

    const newProduct = new Product();

    const barcodes =
        bCLProduct.barcode_formats.split(', ')
            .map((value: string) => {
              return value.split(' ')[1];
            });

    switch ((bCLProduct['barcode_type'] as string).toLowerCase()) {
      case ProductCodeType.PC_UPC:
        [newProduct.upc, newProduct.ean_jan] = barcodes;
        break;
      case ProductCodeType.PC_ISBN:
        [newProduct.isbn10, newProduct.isbn13] = barcodes;
        break;
      default:
        break;
    }

    for (const key of BarcodeLookupKeys) {
      const accessKey = key as keyof typeof bCLProduct;
      const keyMatch = (accessKey as keyof typeof BLKeyToProductMatch);
      if (Array.isArray(bCLProduct[accessKey]) && bCLProduct[accessKey].length) {
        (newProduct as any)[(BLKeyToProductMatch as any)[keyMatch]] = bCLProduct[accessKey]
      }
      if (bCLProduct[accessKey]) {
        (newProduct as any)[(BLKeyToProductMatch as any)[keyMatch]] = bCLProduct[accessKey]
      }
    }

    if (bCLProduct.stores.length) {
      if (!newProduct.other) newProduct.other = {};
      newProduct.other =
          Object.assign(newProduct.other, {stores: bCLProduct.stores});
    }

    if (bCLProduct.reviews.length) {
      if (!newProduct.other) newProduct.other = {};
      newProduct.other =
          Object.assign(newProduct.other, {stores: bCLProduct.reviews});
    }

    if (bCLProduct.images.length) {
      if (!newProduct.other) newProduct.other = {};
      newProduct.other =
          Object.assign(newProduct.other, {images: bCLProduct.images});
    }

    return newProduct;
  }
}

const TestProduct = {
  "products": [
    {
      "barcode_number": "094841255170",
      "barcode_type": "UPC",
      "barcode_formats": "UPC 094841255170, EAN 0094841255170",
      "mpn": "1806546",
      "model": "",
      "asin": "",
      "product_name": "Similasan Ear Wax Removal Aid 0 33 Fl Oz 10 Ml",
      "title": "",
      "category": "Health & Beauty > Health Care > Medicine & Drugs",
      "manufacturer": "Similasan",
      "brand": "Similasan",
      "label": "",
      "author": "",
      "publisher": "",
      "artist": "",
      "actor": "",
      "director": "",
      "studio": "",
      "genre": "",
      "audience_rating": "Adult",
      "ingredients": "",
      "nutrition_facts": "",
      "color": "Multicolor",
      "format": "",
      "package_quantity": "",
      "size": "1 Kit",
      "length": "",
      "width": "",
      "height": "",
      "weight": "0.10 lb",
      "release_date": "",
      "description": "Designed for gentle removal of ear wax without using peroxide. For occasional use as an aid to soften, loosen, and remove excessive ear wax. According to homeopathic principles, the ingredients in this medication also provide temporary relief from symptoms such as: clogged sensation when caused by ear wax, ringing in the ear when caused by ear wax, dry skin and itching of the ear canal. Peroxide free. Formulated with natural ingredients. Non-drying. Includes ear bulb syringe. Active ingredients of the ear drops are manufactured according to homeopathic principles.",
      "features": [],
      "images": [
        "https://images.barcodelookup.com/3149/31490867-1.jpg"
      ],
      "stores": [
        {
          "store_name": "Target",
          "store_price": "6.79",
          "product_url": "https://www.target.com/p/similasan-peroxide-free-ear-wax-removal-kit-0-33oz/-/A-50025770&intsrc=CATF_1444",
          "currency_code": "USD",
          "currency_symbol": "$"
        },
        {
          "store_name": "HerbsPro",
          "store_price": "8.53",
          "product_url": "https://www.herbspro.com/ear-wax-removal-kit-129850",
          "currency_code": "USD",
          "currency_symbol": "$"
        },
        {
          "store_name": "Thrive Market",
          "store_price": "7.99",
          "product_url": "https://thrivemarket.com/p/similasan-corp-ear-wax-removal-kit",
          "currency_code": "USD",
          "currency_symbol": "$"
        },
        {
          "store_name": "Walgreens",
          "store_price": "10.99",
          "product_url": "https://www.walgreens.com/store/c/similasan-ear-wax-removal-kit,-homeopathic/ID=prod6384883-product",
          "currency_code": "USD",
          "currency_symbol": "$"
        },
        {
          "store_name": "CVS",
          "store_price": "11.29",
          "product_url": "https://www.cvs.com/shop/similasan-ear-wax-relief-drops-0-33-oz-prodid-1010930?skuid=251331&WT.mc_id=ps_google_pla_251331",
          "currency_code": "USD",
          "currency_symbol": "$"
        },
        {
          "store_name": "Rakuten.com",
          "store_price": "13.41",
          "product_url": "https://www.rakuten.com/shop/otcshoppeexpress/product/5226501/?sku=5226501&scid=af_feed",
          "currency_code": "USD",
          "currency_symbol": "$"
        },
        {
          "store_name": "Professional Supplement Center",
          "store_price": "12.79",
          "product_url": "https://www.professionalsupplementcenter.com/Ear-Wax-Removal-Kit-by-Similasan.htm",
          "currency_code": "USD",
          "currency_symbol": "$"
        },
        {
          "store_name": "House of Nutrition",
          "store_price": "13.55",
          "product_url": "http://www.houseofnutrition.com/similasan-ear-wax-removal-kit-ear-drops-ear-bulb-syringe-10-ml-0-33-oz/",
          "currency_code": "USD",
          "currency_symbol": "$"
        },
        {
          "store_name": "GoVets",
          "store_price": "13.84",
          "product_url": "https://www.govets.com/consumer-products/medical-and-healthcare/similasan-homeopathy-094841255170-274-459517",
          "currency_code": "USD",
          "currency_symbol": "$"
        },
        {
          "store_name": "Walmart",
          "store_price": "16.39",
          "product_url": "https://www.walmart.com/ip/Similasan-Ear-Wax-Removal-Aid-0-33-fl-oz-10-ml/107660702&intsrc=CATF_4287",
          "currency_code": "USD",
          "currency_symbol": "$"
        },
        {
          "store_name": "Wal-Mart.com US - Paused",
          "store_price": "16.39",
          "product_url": "https://www.walmart.com/ip/Similasan-Ear-Wax-Removal-Aid-0-33-fl-oz-10-ml/107660702",
          "currency_code": "USD",
          "currency_symbol": "$"
        }
      ],
      "reviews": []
    }
  ]
}
