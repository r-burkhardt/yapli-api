import {Request, Response, NextFunction} from 'express';
import {HttpException} from '../models/HttpException';


export const errorHandling = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  const status: number = error.status || 500;
  const message: string = error.message || 'Something went wrong';

  console.error('[ERROR] ', status, message);

  res.status(status).json({ message });
}