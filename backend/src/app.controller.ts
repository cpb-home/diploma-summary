import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AdminService } from './admin/admin.service';
import { Admin } from 'mongodb';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { Connection, Model } from 'mongoose';
import { createHash } from 'crypto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, 
    private adminService: AdminService
  ) {}

  @Get()
  async serverIsWorking(): Promise<string> {
    // ДЛЯ ОТЛАДКИ СОЗДАЁМ ГЛАВНОГО АДМИНА
    const allUsers = await this.adminService.getAllUsers();
    let message = 'Main admin already exist';
    if (allUsers) {
      const mainAdmin = allUsers.find(e => e.email === 'mainAdmin@admin.ru');
      if (!mainAdmin) {
        const pass = '55555';
        const hash = createHash("md5").update(pass).digest("hex");
          this.adminService.createUser({
          email: "admin@admin.ru",
          passwordHash: hash,
          name: "main",
          contactPhone: "55555",
          role: "mainAdmin"
        });
        message = 'Main admin created.';
      }
    }

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

    return this.appService.serverIsWorking(message);
  }
}
