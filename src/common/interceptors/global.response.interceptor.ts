import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDTO } from '../dto/responseDTO';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseDTO<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseDTO<T>> {
    return next.handle().pipe(
      map((data) => ({
        status: 'success',
        message: data.message,
        data: data.data,
      })),
    );
  }
}
