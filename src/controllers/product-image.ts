import {Request, Response} from 'express';


export class ProductImage {
  getProductImage = (req: Request, res: Response) => {
    res.send('Get listing image');
  }

  getAllProductImageByProduct = (req: Request, res: Response) => {
    res.send('Get all listing image by listing');
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
