/**
 * New Yapli API based on node js and developed in type script.
 */
import {App} from './app';
import {ListingRoutes} from './routes/listing';
import {ListingImageRoutes} from './routes/listing-image';
import {SalesRoutes} from './routes/sales';
import {UtilsRoutes} from './routes/utils';


const app = new App([
    new ListingRoutes(),
    new ListingImageRoutes(),
    new SalesRoutes(),
    new UtilsRoutes(),
  ]);

app.listen();


// import app from './app';
//
// const server = app.listen(app.get('port'), () => {
//   console.log(
//       `App is running on http://localhost:${app.get('port')} in ${app.get('env')} mode.`
//   );
// });
//
// export default server;
