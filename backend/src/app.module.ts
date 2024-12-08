import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { User, UserSchema } from './schemas/user.schema';
import { Hotel, HotelSchema } from './schemas/hotel.schema';
import { CommonModule } from './common/common.module';
import { HotelRoom, HotelRoomSchema } from './schemas/hotelRoom.schema';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema }
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
    AdminModule,
    CommonModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController, AdminController],
  providers: [AppService, AdminService, AuthService],
})
export class AppModule {}
