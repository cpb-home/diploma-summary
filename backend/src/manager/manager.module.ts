import { Module } from '@nestjs/common';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { UsersModule } from 'src/users/users.module';
import { ClientModule } from 'src/client/client.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Reservation, ReservationSchema } from 'src/schemas/reservation.schema';
import { Hotel, HotelSchema } from 'src/schemas/hotel.schema';
import { HotelRoom, HotelRoomSchema } from 'src/schemas/hotelRoom.schema';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { SupportRequest, SupportRequestSchema } from 'src/schemas/supportRequest.schema';

@Module({
  imports: [
    UsersModule,
    ClientModule,
    MongooseModule.forRoot(process.env.MONGO_CONNECTION),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Reservation.name, schema: ReservationSchema },
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema},
      { name: SupportRequest.name, schema: SupportRequestSchema },
    ]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string>('EXPIRESIN'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [ManagerController],
  providers: [ManagerService],
  exports: [ManagerService],
})
export class ManagerModule {}
