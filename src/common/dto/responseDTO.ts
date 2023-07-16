export class ResponseDTO<T> {
  status: string;
  message: string;
  data: T;
}
