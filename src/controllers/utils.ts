import {Request, Response} from 'express';
import {Database} from '../utilities/database';
import {YapliStockNumber} from '../utilities/yapli-stock-number';


export class Utils {
  db = new Database();
  ysn = new YapliStockNumber();

  getUtils = (req: Request, res: Response) => {
    res.send('utils');
  }

  getYsn = (req: Request, res: Response) => {
    const ysnReqCount = req.query.count || 1;
    const newYsnNums = this.ysn.getYapliStockNumbers(ysnReqCount);
    newYsnNums.then((values) => {
      res.status(200)
          .json({
            success: true,
            count: values.length,
            ysn: values,
          });
    }).catch((err) => {
      res.status(200)
        .json({
            success: false,
            message: err
          });
    });
  }
}
