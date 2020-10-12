import {Router} from 'express';
import {UserController} from '../controllers/user.controller';


export class UserRoutes {
  path = '/user';
  router = Router();
  userController = new UserController();

  constructor () {
    this.initRoutes()
  }

  private initRoutes() {
    this.router.get(`${this.path}/:id`, this.userController.getUser);
    this.router.post(`${this.path}/`, this.userController.postUser);
    this.router.put(`${this.path}/:id`, this.userController.putUser);
    this.router.delete(`${this.path}/:id`, this.userController.deleteUser);
  }
}


