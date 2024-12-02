import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { FromBaseUser } from 'src/interfaces/fromBaseUser';
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
    return await this.HotelModel.find().exec();
  }

  public async getHotelInfo(id: Types.ObjectId): Promise<HotelDocument> {
    return await this.HotelModel.findOne({_id: id});
  }

  public async getAllRooms(startDate?: Date, finDate?: Date): Promise<HotelRoomDocument[]> {
    console.log('from getAllRooms', startDate, finDate);
    return await this.HotelRoomModel.find().exec();
  }

  public async getAllAvailableRooms(startDate?: Date, finDate?: Date): Promise<HotelRoomDocument[]> {
    console.log('from getAll', startDate, finDate);
    return await this.HotelRoomModel.find({isEnabled: true}).exec();
  }

  public async getRoomInfo(id: Types.ObjectId): Promise<HotelRoomDocument> {
    return await this.HotelRoomModel.findOne({_id: id});
  }

  public async getAvailableRoomsForHotel(hotelId: Types.ObjectId, startDate?: Date, finDate?: Date): Promise<HotelRoomDocument[]> {
    console.log('from getAvailable', hotelId, startDate, finDate);
    const rooms = await this.HotelRoomModel.find({hotel: hotelId, isEnabled: true});
    return rooms;
    //return await this.HotelRoomModel.find({hotel: hotelId, isEnabled: true});
  }

  public async getUserInfo(email: string): Promise<FromBaseUser> {
    return this.UserModel.findOne({email});
  }



  public async getExistedRoomsForHotel(hotelId: string): Promise<HotelRoomDocument[]> {
    return await this.HotelRoomModel.find({hotel: hotelId});;
  }
}
