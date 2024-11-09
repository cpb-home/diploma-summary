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
    return this.appService.serverIsWorking(message);
  }
}
