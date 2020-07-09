/**
 * New Yapli API based on node js and developed in type script.
 */
import {App} from './app';
import {ProductRoutes} from './routes/product';
import {ProductImageRoutes} from './routes/product-image';
import {SalesRoutes} from './routes/sales';
import {UtilsRoutes} from './routes/utils';


const app = new App([
    new ProductRoutes(),
    new ProductImageRoutes(),
    new SalesRoutes(),
    new UtilsRoutes(),
  ]);

app.listen();
