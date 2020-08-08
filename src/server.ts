/**
 * New Yapli API based on node js and developed in type script.
 */
import {App} from './app';
import {ProductRoutes} from './routes/product';
import {ProductImageRoutes} from './routes/product-image';
import {SalesRoutes} from './routes/sales';
import {UtilsRoutes} from './routes/utils';
import {UserRoutes} from './routes/user';
import {UserAddressRoutes} from './routes/user-address';
import {SellerRoutes} from './routes/seller';
import {ProductVarianceRequestRoutes} from './routes/product-variance';


const app = new App([
    new ProductRoutes(),
    new ProductImageRoutes(),
    new SalesRoutes(),
    new UtilsRoutes(),
    new UserRoutes(),
    new UserAddressRoutes(),
    new SellerRoutes(),
    new ProductVarianceRequestRoutes(),
  ]);

app.listen();
