import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AdminService } from './admin/admin.service';
import { createHash } from 'crypto';
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

    /*
    // ДЛЯ ОТЛАДКИ СОЗАДЁМ 15 ГОСТИНИЦ
    const names = [
      'Radisson',
      'Atlantis Temple Hotel & Spa',
      'Soft Bay Resort & Spa',
      'Autumn Bliss Resort',
      'Pleasant Shield Resort & Spa',
      'Private Shrine Hotel',
      'Silver Peaks Motel',
      "Queen's Luxury Hotel & Spa",
      'Ivory Chasm Resort',
      'Remote Heights Hotel & Spa',
      'Exalted Cave Motel',
      'Twin Haven Resort & Spa',
      'Serene Bliss Resort & Spa',
      'Exalted Harbor Motel',
      'Southern Brewery Hotel',
      'Summer Excalibur Motel'
    ];
    for (let i = 1; i < 16; i++) {
      const hotel = names.pop();
      const title = `Гостиница ${hotel}`;
      const description = `Какое-то разумное, но не слишком громоздкое описание Гостиницы ${hotel}.\n Вот какое есть!`;
      this.adminService.createHotel({title: hotel, description});
    }
  */
    return this.appService.serverIsWorking(message);
  }
}
