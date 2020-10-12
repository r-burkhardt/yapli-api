/**
 * New Yapli API based on node js and developed in type script.
 */
import {App} from './app';
import {ProductRoutes} from './routes/product.routes';
import {ProductImageRoutes} from './routes/product-image.routes';
import {SalesRoutes} from './routes/sales.routes';
import {UtilsRoutes} from './routes/utils.routes';
import {UserRoutes} from './routes/user.routes';
import {UserAddressRoutes} from './routes/user-address.routes';
import {SellerRoutes} from './routes/seller.routes';
import {ProductVarianceRequestRoutes} from './routes/product-variance.routes';
import {OrderRoutes} from './routes/order.routes';
import {OrderTransactionRoutes} from './routes/order-transaction.routes';


const app = new App([
    new ProductRoutes(),
    new ProductImageRoutes(),
    new SalesRoutes(),
    new UtilsRoutes(),
    new UserRoutes(),
    new UserAddressRoutes(),
    new SellerRoutes(),
    new ProductVarianceRequestRoutes(),
    new OrderRoutes(),
    new OrderTransactionRoutes()
  ]);

app.listen();
