import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response, Request } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status =  exception.hasOwnProperty('getStatus') ? exception.getStatus() : 400;

      response
        .status(status)
        .json({
          statusCode: status,
          message: exception.message,
          timestamp: new Date().toISOString(),
          path: request.url,
        })
  }
}