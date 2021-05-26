import express = require('express');
import bodyParser = require('body-parser');
import cors = require('cors');
import cookieParser from 'cookie-parser';
import {Route} from './interfaces/routes';
import {errorHandling} from './middleware/error-handling';
// import mysql from 'mysql';
// import mongodb = require('mongodb');

// import {DBConfig} from './enviroment';


export class App {
  private app: express.Application;
  private hostAddress: string;
  private port: (string | number);
  private env: boolean;

  constructor (routes: Route[]) {
    this.app = express();
    this.hostAddress = process.env.IP || 'localhost';
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV === 'production' ? true : false;

    this.initMiddleware();
    this.initRoutes(routes);
    this.initErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running at http://${this.hostAddress}:${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initRoutes(routes: Route[]) {
    // const db = mysql.createConnection(DBConfig);
    // db.connect((err: any) => {
    //   if (!err) {
    //     console.debug('Connection Established Successfully');
    //     db.destroy();
    //   } else {
    //     console.debug(
    //         'Connection Failed!'+ JSON.stringify(err,undefined,2)
    //     );
    //   }
    // });
    // this.app.set('db', db);
    routes.forEach((route) => {
      this.app.use('/_api/v1', route.router);
    })
  }

  private initErrorHandling() {
    this.app.use(errorHandling);
  }

  private initMiddleware() {
    if (this.env) {
      this.app.use(cors({ origin: 'your.domain.com', credentials: true }));
    } else {
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }
}














// import * as bodyParser from 'body-parser';
// import * as cookieParser from 'cookie-parser'
// import * as express from 'express'
// import * as logger from 'morgan'
// import * as path from 'path'
//
// // import {globeFiles} from '../helpers';
//
// export default function () {
//   const app: express.Express = express();
//
//   // for (const model of globFiles(MODELS_DIR))
//
//
//   app.use(logger('dev'));
//   app.use(bodyParser.json());
//   app.use(bodyParser.urlencoded({extended: false}));
//   app.use(cookieParser());
//   app.use(express.static(path.join(__dirname, './public')));
//
//   return app;
// }
