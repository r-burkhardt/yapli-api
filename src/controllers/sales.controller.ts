import {Request, Response} from 'express';


export class SalesController {
  getSales  = (req: Request, res: Response) => {
    res.send('Get sales');
  };

  getAllSalesBySeller = (req: Request, res: Response) => {
    res.send('Get all sales by seller');
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
