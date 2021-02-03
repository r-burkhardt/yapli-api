import {Application, request, response, Router} from 'express';
import {ProductController} from '../controllers/product.controller';


export class ProductRoutes {
  path = '/product';
  router = Router();
  productController = new ProductController();

  constructor () {
    this.initRoutes();
  }

  private initRoutes() {
    // this.router.get(`${this.path}`, this.productController.getAllProduct);
    this.router.get(`${this.path}`, this.productController.getProduct);
    this.router.post(`${this.path}`, this.productController.postProduct);
    this.router.put(`${this.path}/:id`, this.productController.putProduct);
    this.router.delete(`${this.path}/:id`, this.productController.deleteProduct);
    this.router
        .get(`${this.path}/product-code`, this.productController.productCode);
  }
}

