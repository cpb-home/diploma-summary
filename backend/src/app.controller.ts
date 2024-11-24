import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AdminService } from './admin/admin.service';
import createBasicInfo from './functions/createBasicInfo';
import { CommonService } from './common/common.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, 
    private readonly adminService: AdminService,
    private readonly commonService: CommonService,
  ) {}

  @Get()
  async serverIsWorking(): Promise<string> {
    let message = '<br>Backend стартовал.<br>';

    message += await createBasicInfo(this.adminService, this.commonService);

    return this.appService.serverIsWorking(message);
  }
}
