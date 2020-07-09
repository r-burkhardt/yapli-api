import {Router} from 'express';
import {ProductImage} from '../controllers/product-image';


export class ProductImageRoutes {
  path = '/product_image';
  router = Router();
  productImageController = new ProductImage();

  constructor () {}

  private initRoutes() {
    this.router.get(`${this.path}/:listing`, this.productImageController.getAllProductImageByProduct);
    this.router.get(`${this.path}/:id`, this.productImageController.getProductImage);
    this.router.post(`${this.path}/`, this.productImageController.postProductImage);
    this.router.put(`${this.path}/:id`, this.productImageController.putProductImage);
    this.router.delete(`${this.path}/:id`, this.productImageController.deleteProductImage);
  }
}
