import {Request, Response} from 'express';
import {YapliStockNumber} from '../utilities/yapli-stock-number';
import {MongoDatabase} from '../utilities/mongo-database';
import {YProductsConfig} from '../enviroment';
import {Product, ProductValidation} from '../models/product';
import * as HttpStatus from 'http-status-codes';
import {RequiredPCVerifyParams} from '../constants/product.constants';
import {processMessage} from '../utilities/helpers';
import {APIResponse} from '../interfaces/types';
import {YapliErrorCodes} from '../utilities/yapli-error-codes';


/**
 * API Product Controller
 */
export class ProductController {
  _YSN = new YapliStockNumber();
  _mongo = new MongoDatabase(YProductsConfig);
  readonly CollectionName = 'yp_product';
  readonly SellerIdForTesting = '11eaa404-569a-e3b4-b285-609ae09857ed';

  getProduct = async (req: Request, res: Response) => {}

  postProduct = async (req: Request, res: Response) => {}

  putProduct = async (req: Request, res: Response) => {}

  deleteProduct = async (req: Request, res: Response) => {
    res.type('application/json');

    res.status(400).json({msg: 'Not implemented'});
  }

  productCode = async (req: Request, res: Response) => {
    res.type('application/json');
    const type = req.query.type;
    const code = req.query.code;
    const condition = req.query.condition;

    let validation: ProductValidation;

    if (req.query.hasOwnProperty('verify') && type && code &&
        !isNaN(Number(code)) && condition) {
      await this.productCodeValidation(code, type, condition);
    } else {
      let message: string | string[] = '';

      for (const key of Object.keys(RequiredPCVerifyParams)) {
        const morphKey = key as keyof typeof RequiredPCVerifyParams;
        const param = RequiredPCVerifyParams[morphKey];
        if (param.func(req.query)) {
          message = processMessage(message, param.msg);
        }
      }

      res.status(HttpStatus.PRECONDITION_REQUIRED)
          .json({
            success: false,
            msg: 'message'
          });
    }
  }

  private async productCodeValidation (
      code: string,
      type: string,
      condition: string
  ): Promise<any> {
    let product: any | any[];
    let bCLProduct: any;
    const validation =
        Product.validateProductCode(type, code);
    let response: APIResponse = {
      status: HttpStatus.BAD_REQUEST,
      success: false,
    };

    if (validation.valid) {
      // Connect to database
      return Object.assign(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            success: false
          },
          YapliErrorCodes.DATABASE_001
      );
    }
  }
}
