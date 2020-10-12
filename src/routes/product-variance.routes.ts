import {Application, request, response, Router} from 'express';
import {ProductVarianceRequest} from '../controllers/product-variance.controller';


export class ProductVarianceRequestRoutes {
  path = '/product_variance_request';
  router = Router();
  productVarianceRequestController = new ProductVarianceRequest();

  constructor () {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(`${this.path}`, this.productVarianceRequestController.getProductVarianceRequest);
    this.router.post(`${this.path}`, this.productVarianceRequestController.postProductVarianceRequest);
    this.router.put(`${this.path}/:id`, this.productVarianceRequestController.putProductVarianceRequest);
    this.router.delete(`${this.path}/:id`, this.productVarianceRequestController.deleteProductVarianceRequest);
  }
}
