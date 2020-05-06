import {Request, Response} from 'express';
import {Database} from '../utilities/database';
import {YapliStockNumber} from '../utilities/yapli-stock-number';


const YSN = new YapliStockNumber();

export class Listing {
  db = new Database();

  getListing = async (req: Request, res: Response) => {
    const reqYSN = req.params.ysn;
    const conn = await this.db.connect();
    await conn.query(
        `SELECT * FROM ppb_listings WHERE id = ${reqYSN};`,
        (err: any, rows: any, fields: any) => {
          if (err) {
            res.status(500)
                .json({
                  success: false,
                  message: err
                });
            return;
          }
          res.status(200);
          if (rows[0]) {
            res.json({
              success: true,
              listing: rows[0]
            });
          } else {
            res.json({
              success: false,
              message: 'Listing not found'
            });
          }
        });
  };

  getAllListing = async (req: Request, res: Response) => {
    const conn = await this.db.connect();
    await conn.query(
      'SELECT * FROM ppb_listings;',
      (err: any, rows: any, fields: any) => {
        if (err) {
          res.status(500).json({
            success: 'error',
            message: err,
          });
          return;
        }
        const results: any = [];
        rows.forEach((row: any) => {
          results.push(JSON.parse(JSON.stringify(row)))
        });
        res.status(200).json({
          success: true,
          count: results.length,
          listings: results,
        });
      }
    );
  };

  getAllListingByVendor = async (req: Request, res: Response) => {
    res.send('Get all listing by vendor');
  };

  postListing = async (req: Request, res: Response) => {
    // console.log(req);
    // const listing = req.body;
    // const conn = await this.db.connect();
    // await conn.query(
    //     'INSERT INTO ppb_listings SET ?',
    //     listing,
    //     (err: any, result: any) => {
    //       if (err) {
    //         res.status(500).json({
    //           success: 'error',
    //           message: err,
    //         });
    //         return;
    //       }
    //       res.status(200).json({
    //         success: true,
    //         listings: result,
    //       });
    //     });
    res.status(200).json();
  };

  putListing = async (req: Request, res: Response) => {
    res.send('Put listing');
  };

  deleteListing = (req: Request, res: Response) => {
    res.send('Delete listing');
  };
}
