import {Router} from 'express';
import {UtilsController} from '../controllers/utils.controller';


export class UtilsRoutes {
  path = '/utils';
  router = Router();
  utilsController = new UtilsController();

  constructor () {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(`${this.path}/`, this.utilsController.getUtils);
    this.router.get(`${this.path}/ysn/`, this.utilsController.getYsn);
    this.router.get(`${this.path}/status/`, this.utilsController.getStatus);
  }
}
