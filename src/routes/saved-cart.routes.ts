import {Router} from 'express';
import {SavedCartController} from '../controllers/saved-cart.controller';


export class SavedCartRoutes {
  path = '/saved-cart';
  router = Router();
  savedCartController = new SavedCartController();

  constructor () {
    this.initRoutes()
  }

  private initRoutes() {
    this.router.get(`${this.path}/:id`, this.savedCartController.getSavedCart);
    this.router.post(`${this.path}/:id`, this.savedCartController.postSavedCart);
    this.router.put(`${this.path}/:id`, this.savedCartController.putSavedCart);
    this.router.delete(`${this.path}/:id`, this.savedCartController.deleteSavedCart);
  }
}
