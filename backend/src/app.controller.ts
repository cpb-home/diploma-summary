import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AdminService } from './admin/admin.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  serverIsWorking(): string {
    /*
    const allUsers = this.adminService.getAllUsers();
    if (allUsers) {
      console.log(allUsers);
    }
    */
    return this.appService.serverIsWorking();
  }
}
