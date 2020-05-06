import {Router} from 'express';
import {Listing} from '../controllers/listing';


export class ListingRoutes {
  path = '/listing';
  router = Router();
  listingController = new Listing();

  constructor () {
    this.initRoutes()
  }

  private initRoutes() {
    this.router.get(`${this.path}`, this.listingController.getAllListing);
    this.router.get(`${this.path}/:ysn`, this.listingController.getListing);
    this.router.post(`${this.path}`, this.listingController.postListing);
    this.router.put(`${this.path}/:id`, this.listingController.putListing);
    this.router.delete(`${this.path}/:id`, this.listingController.deleteListing);
  }
}
