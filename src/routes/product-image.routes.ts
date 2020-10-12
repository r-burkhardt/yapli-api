import {Router} from 'express';
import {ProductImageController} from '../controllers/product-image.controller';


export class ProductImageRoutes {
  path = '/product_image';
  router = Router();
  productImageController = new ProductImageController();

  constructor () {}

  private initRoutes() {
    this.router.get(`${this.path}/:id`, this.productImageController.getProductImage);
    this.router.post(`${this.path}/`, this.productImageController.postProductImage);
    this.router.put(`${this.path}/:id`, this.productImageController.putProductImage);
    this.router.delete(`${this.path}/:id`, this.productImageController.deleteProductImage);
  }
}
