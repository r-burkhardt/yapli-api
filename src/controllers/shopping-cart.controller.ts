import {Request, Response} from 'express';
import {MongoDatabase} from '../utilities/mongo-database';
import {MongoError, ObjectID, UpdateWriteOpResult} from 'mongodb';
import * as httpStatus from 'http-status-codes';
import {YUsersConfig} from '../enviroment';


export class ShoppingCartController {
  mongo = new MongoDatabase(YUsersConfig);
  readonly CollectionName = 'yu_shopping_cart';

  getShoppingCart = async (req: Request, res: Response) => {
    res.type('application/json');

    res.status(400).json({msg: 'Not implemented'});
  }

  postShoppingCart = async  (req: Request, res: Response) => {
    res.type('application/json');

    res.status(400).json({msg: 'Not implemented'});
  }

  putShoppingCart = async  (req: Request, res: Response) => {
    res.type('application/json');

    res.status(400).json({msg: 'Not implemented'});
  }

  deleteShoppingCart = async  (req: Request, res: Response) => {
    res.type('application/json');

    res.status(400).json({msg: 'Not implemented'});
  }
}
