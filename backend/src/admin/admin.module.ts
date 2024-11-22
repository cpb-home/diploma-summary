import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Hotel, HotelSchema } from 'src/schemas/hotel.schema';
import { HotelRoom, HotelRoomSchema } from 'src/schemas/hotelRoom.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ])
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})

export class AdminModule {}
