import { ArgumentsHost, ExceptionFilter, HttpException } from "@nestjs/common";
import { MongoError } from "mongodb";

export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    switch (exception.code) {
      case 11000:
        throw new HttpException('Такой пользователь уже существует', 403);
    }
  }
}