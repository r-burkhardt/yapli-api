import {Router} from 'express';
import {SalesController} from '../controllers/sales.controller';


export class SalesRoutes {
  path = '/sales';
  router = Router();
  salesController = new SalesController();

  constructor () {
    this.initRoutes()
  }

  private initRoutes() {
    this.router.get(`${this.path}/:seller`, this.salesController.getAllSalesBySeller);
    this.router.get(`${this.path}/:id`, this.salesController.getSales);
    this.router.post(`${this.path}/`, this.salesController.postSales);
    this.router.put(`${this.path}/:id`, this.salesController.putSales);
    this.router.delete(`${this.path}/:id`, this.salesController.deleteSales);
  }
}
