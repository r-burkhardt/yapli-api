import {Request, Response} from 'express';


export class ProductImageController {
  getProductImage = (req: Request, res: Response) => {
    res.send('Get listing image');
  }

  postProductImage = (req: Request, res: Response) => {
    res.send('Post listing image');
  }

  putProductImage = (req: Request, res: Response) => {
    res.send('Put listing image');
  }

  deleteProductImage = (req: Request, res: Response) => {
    res.send('Delete listing image');
  }
}
