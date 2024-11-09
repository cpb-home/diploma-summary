import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AdminService } from './admin/admin.service';
import { Admin } from 'mongodb';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { Connection, Model } from 'mongoose';

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
          this.adminService.createUser({
          email: "mainAdmin@admin.ru",
          passwordHash: "as",
          name: "main",
          contactPhone: "555",
          role: "mainAdmin"
        });
        message = 'Main admin created.';
      }
    }
    return this.appService.serverIsWorking(message);
  }
}
