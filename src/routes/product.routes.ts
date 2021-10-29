import {Router} from 'express';
import {ProductController} from '../controllers/product.controller';


/**
 * API Product Routes
 */
export class ProductRoutes {
  path = '/product';
  router = Router();
  productController = new ProductController();

  /**
   * Constructor
   */
  constructor () {
    this.initRoutes();
  }

  /**
   * InitRoutes
   * @private
   */
  private initRoutes () {
    this.router
        .get(`${this.path}`, this.productController.getProduct);
    this.router
        .post(`${this.path}`, this.productController.postProduct);
    this.router
        .put(`${this.path}/:id`, this.productController.putProduct);
    this.router
        .delete(`${this.path}/:id`, this.productController.deleteProduct);
    this.router
        .get(`${this.path}/product-code`, this.productController.productCode);
  }
}

