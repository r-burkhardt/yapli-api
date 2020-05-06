import {Router} from 'express';
import {ListingImage} from '../controllers/listing-image';


export class ListingImageRoutes {
  path = '/listing_image';
  router = Router();
  listingImageController = new ListingImage();

  constructor () {}

  private initRoutes() {
    this.router.get(`${this.path}/:listing`, this.listingImageController.getAllListImageByListing);
    this.router.get(`${this.path}/:id`, this.listingImageController.getListImage);
    this.router.post(`${this.path}/`, this.listingImageController.postListImage);
    this.router.put(`${this.path}/:id`, this.listingImageController.putListImage);
    this.router.delete(`${this.path}/:id`, this.listingImageController.deleteListImage);
  }
}
