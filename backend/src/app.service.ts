import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  serverIsWorking(): string {
    return 'Server is working well!';
  }
}
