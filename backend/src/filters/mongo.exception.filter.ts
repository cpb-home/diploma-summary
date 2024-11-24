import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { MongoError, MongoServerError } from "mongodb";

@Catch()
export class MongoExceptionFilter implements ExceptionFilter { 
  catch(exception: MongoError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    switch (exception.code) {
      case 11000:
        console.log('err1')
        //throw new HttpException('Такой пользователь уже существует', 403);
        response.status(403).json({ message: 'Такой пользователь уже существует.' });
      default: 
        //throw new HttpException('Непонятная ошибка базы данных', 500);
        response.status(500).json({ message: 'Непонятная ошибка базы данных.' });
    }
  }
}