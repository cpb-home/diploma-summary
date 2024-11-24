import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response, Request } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      let status: number;
      let message: string;

      if (exception instanceof HttpException) {
        status = exception.getStatus();
        message = exception.message;
      } else if (typeof exception === 'string') {
        // Здесь можно добавить обработку ошибки 11000
        if (exception.includes('E11000')) {
          status = HttpStatus.CONFLICT;
          message = 'Такой пользователь уже существует.';
        } else {
          console.error(exception); // Логи ошибки
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = 'Внутренняя ошибка сервера';
        }
      } else if (!status && !message) {
        console.error(exception);
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Возникла неизвестная ошибка';
      }

      response
        .status(status)
        .json({
          statusCode: status,
          message: message,
          timestamp: new Date().toISOString(),
          path: request.url,
        })
      
  }
}