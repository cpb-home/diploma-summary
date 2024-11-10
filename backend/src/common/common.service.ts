import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Hotel, HotelDocument } from 'src/schemas/hotel.schema';
import { HotelRoom, HotelRoomDocument } from 'src/schemas/hotelRoom.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class CommonService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
    @InjectModel(HotelRoom.name) private HotelRoomModel: Model<HotelRoomDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  public async getAllHotels(): Promise<HotelDocument[]> {
    return this.HotelModel.find().exec();
  }

  public async getAllRooms(): Promise<HotelRoomDocument[]> {
    return this.HotelRoomModel.find().exec();
  }

  public async getRoomInfo(id: string): Promise<HotelRoomDocument> {
    return this.HotelRoomModel.findOne({_id: id});
  }
}
