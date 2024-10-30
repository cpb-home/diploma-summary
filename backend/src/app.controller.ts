import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  serverIsWorking(): string {
    return this.appService.serverIsWorking();
  }
}
