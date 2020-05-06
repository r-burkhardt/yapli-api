import {Router} from 'express';
import {Sales} from '../controllers/sales';


export class SalesRoutes {
  path = '/sales';
  router = Router();
  salesController = new Sales();

  constructor () {
    this.initRoutes()
  }

  private initRoutes() {
    this.router.get(`${this.path}/:vendor`, this.salesController.getAllSalesByVendor);
    this.router.get(`${this.path}/:id`, this.salesController.getSales);
    this.router.post(`${this.path}/`, this.salesController.postSales);
    this.router.put(`${this.path}/:id`, this.salesController.putSales);
    this.router.delete(`${this.path}/:id`, this.salesController.deleteSales);
  }
}
