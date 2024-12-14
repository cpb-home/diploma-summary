import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Hotel, HotelSchema } from 'src/schemas/hotel.schema';
import { HotelRoom, HotelRoomSchema } from 'src/schemas/hotelRoom.schema';
import { Reservation, ReservationSchema } from 'src/schemas/reservation.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(process.env.MONGO_CONNECTION),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Hotel.name, schema: HotelSchema},
      { name: HotelRoom.name, schema: HotelRoomSchema},
      { name: Reservation.name, schema: ReservationSchema},
    ])
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService]
})
export class ClientModule {}
