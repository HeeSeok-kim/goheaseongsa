import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'];

    if (apiKey !== process.env.API_KEY) {
      res.status(403).json({ message: 'Invalid API Key' });
    } else {
      next();
    }
  }
}
