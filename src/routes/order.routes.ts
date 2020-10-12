import {Router} from 'express';
import {OrderController} from '../controllers/order.controller';


export class OrderRoutes {
  path = '/order';
  router = Router();
  orderController = new OrderController();

  constructor () {
    this.initRoutes()
  }

  private initRoutes() {
    this.router.get(`${this.path}`, this.orderController.getOrder);
    this.router.post(`${this.path}`, this.orderController.postOrder);
    this.router.put(`${this.path}/:id`, this.orderController.putOrder);
    this.router.delete(`${this.path}/:id`, this.orderController.deleteOrder);
  }
}
