import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Hotel, HotelSchema } from 'src/schemas/hotel.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { HotelRoom, HotelRoomSchema } from 'src/schemas/hotelRoom.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Hotel.name, schema: HotelSchema},
      { name: HotelRoom.name, schema: HotelRoomSchema},
    ])
  ],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService]
})

export class CommonModule {}
