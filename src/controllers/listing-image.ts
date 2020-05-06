import {Request, Response} from 'express';


export class ListingImage {
  getListImage = (req: Request, res: Response) => {
    res.send('Get listing image');
  }

  getAllListImageByListing = (req: Request, res: Response) => {
    res.send('Get all listing image by listing');
  }

  postListImage = (req: Request, res: Response) => {
    res.send('Post listing image');
  }

  putListImage = (req: Request, res: Response) => {
    res.send('Put listing image');
  }

  deleteListImage = (req: Request, res: Response) => {
    res.send('Delete listing image');
  }
}
