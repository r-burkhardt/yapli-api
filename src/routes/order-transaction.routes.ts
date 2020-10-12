import {Router} from 'express';
import {OrderTransactionController} from '../controllers/order-transaction.controller';


export class OrderTransactionRoutes {
  path = '/order-transaction';
  router = Router();
  userController = new OrderTransactionController();

  constructor () {
    this.initRoutes()
  }

  private initRoutes() {
    this.router.get(`${this.path}/:id`, this.userController.getOrderTransaction);
    this.router.post(`${this.path}/`, this.userController.postOrderTransaction);
    this.router.put(`${this.path}/:id`, this.userController.putOrderTransaction);
    this.router.delete(`${this.path}/:id`, this.userController.deleteOrderTransaction);
  }
}
