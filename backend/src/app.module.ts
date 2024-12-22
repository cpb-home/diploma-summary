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
import { ClientModule } from './client/client.module';
import { ManagerModule } from './manager/manager.module';
import { AppGateway } from './app.gateway';
import { CommonController } from './common/common.controller';
import { CommonService } from './common/common.service';
import { Reservation, ReservationSchema } from './schemas/reservation.schema';
import { SupportRequest, SupportRequestSchema } from './schemas/supportRequest.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { ClientController } from './client/client.controller';
import { ClientService } from './client/client.service';

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
      { name: HotelRoom.name, schema: HotelRoomSchema },
      { name: Reservation.name, schema: ReservationSchema},
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema},
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
    AdminModule,
    CommonModule,
    AuthModule,
    UsersModule,
    ClientModule,
    ManagerModule,
  ],
  controllers: [AppController, AdminController, CommonController, ClientController],
  providers: [AppService, AdminService, AuthService, AppGateway, CommonService, ClientService],
})
export class AppModule {}
