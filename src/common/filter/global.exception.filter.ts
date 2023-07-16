import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = (exception as Error).message;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    }

    response.status(status).json({
      status: status,
      message: message,
    });
  }
}
