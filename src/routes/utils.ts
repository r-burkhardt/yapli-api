import {Router} from 'express';
import {Utils} from '../controllers/utils';


export class UtilsRoutes {
  path = '/utils';
  router = Router();
  utilsController = new Utils();

  constructor () {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(`${this.path}/`, this.utilsController.getUtils);
    this.router.get(`${this.path}/ysn/`, this.utilsController.getYsn);
  }
}
