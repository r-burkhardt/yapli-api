import {Request, Response} from 'express';


export class Sales {
  getSales  = (req: Request, res: Response) => {
    res.send('Get sales');
  };

  getAllSalesByVendor = (req: Request, res: Response) => {
    res.send('Get all sales by vendor');
  };

  postSales = (req: Request, res: Response) => {
    res.send('Post sales');
  };

  putSales = (req: Request, res: Response) => {
    res.send('Put sales');
  };

  deleteSales = (req: Request, res: Response) => {
    res.send('Delete sales');
  };
}
