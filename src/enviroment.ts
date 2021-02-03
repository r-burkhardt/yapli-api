

// export const DBConfig = {
//   host: 'localhost',
//   user.routes.ts: 'root',
//   password: 'kiDx2Bwq@yap',
//   database: 'yapv8',
// };

// export const DBConfig = {
//   host: 'localhost',
//   user.routes.ts: 'root',
//   password: 'kiDx2Bwq@yap',
//   database: 'yapli_v10',
// };

// export const GCPDBConfig = {
//   host: '35.184.72.74',
//   user.routes.ts: '',
//   password: 'lsDxrrOB5PsbA7OB',
//   database: ''
// }

export enum BarcodeLookupOptions {
  URL = 'https://api.barcodelookup.com/v2/products',
  KEY = '10itrko7rgqk60dtdfngb4cc6qtc03',
}

const databaseConfig = {
  host: 'localhost',
  port: '27017',
  user: '',
  password: '',
}

export const YProductsConfig = Object.assign(
    {database: 'yapli_products_v1'},
    databaseConfig
    );

export const YUsersConfig = Object.assign(
    {database: 'yapli_users_v1'},
    databaseConfig
);

export const YSellersConfig = Object.assign(
    {database: 'yapli_sellers_v1'},
    databaseConfig
);

export const YOrdersConfig = Object.assign(
    {database: 'yapli_orders_v1'},
    databaseConfig
);

export const YNewsConfig = Object.assign(
    {database: 'yapli_orders_v1'},
    databaseConfig
);
