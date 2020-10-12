import {Router} from 'express';
import {UserAddressController} from '../controllers/user-address.controller';


export class UserAddressRoutes {
  path = '/useraddress';
  router = Router();
  userAddressController = new UserAddressController();

  constructor () {
    this.initRoutes()
  }

  private initRoutes() {
    this.router.get(`${this.path}/`, this.userAddressController.getUserAddress);
    this.router.post(`${this.path}/`, this.userAddressController.postUserAddress);
    this.router.put(`${this.path}/:id`, this.userAddressController.putUserAddress);
    this.router.delete(`${this.path}/:id`, this.userAddressController.deleteUserAddress);
  }
}


