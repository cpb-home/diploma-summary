import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  serverIsWorking(message: string = ''): string {
    return 'Server is working well! ' + message;
  }
}
