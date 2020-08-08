import {Router} from 'express';
import {Seller} from '../controllers/seller';


export class SellerRoutes {
  path = '/seller';
  router = Router();
  sellerController = new Seller();

  constructor () {
    this.initRoutes()
  }

  private initRoutes() {
    this.router.get(`${this.path}/:id`, this.sellerController.getSeller);
    this.router.post(`${this.path}/`, this.sellerController.postSeller);
    this.router.put(`${this.path}/:id`, this.sellerController.putSeller);
    this.router.delete(`${this.path}/:id`, this.sellerController.deleteSeller);
  }
}


