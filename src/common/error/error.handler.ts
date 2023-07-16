import { HttpException, HttpStatus } from '@nestjs/common';

export function throwHttpException(message: string, status: HttpStatus): never {
  throw new HttpException(message, status);
}
