import {Router} from 'express';
import {ShoppingCartController} from '../controllers/shopping-cart.controller';


export class SavedCartRoutes {
  path = '/shopping-cart';
  router = Router();
  shoppingCartController = new ShoppingCartController();

  constructor () {
    this.initRoutes()
  }

  private initRoutes() {
    this.router.get(`${this.path}/:id`, this.shoppingCartController.getShoppingCart);
    this.router.post(`${this.path}/:id`, this.shoppingCartController.postShoppingCart);
    this.router.put(`${this.path}/:id`, this.shoppingCartController.putShoppingCart);
    this.router.delete(`${this.path}/:id`, this.shoppingCartController.deleteShoppingCart);
  }
}
