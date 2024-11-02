import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CreateHotelDto } from 'src/interfaces/dto/create-hotel';
import { CreateUserDto } from 'src/interfaces/dto/create-user';
import { UpdateHotelDto } from 'src/interfaces/dto/update-hotel';
import { UpdateUserDto } from 'src/interfaces/dto/update-user';
import { Hotel, HotelDocument } from 'src/schemas/hotel.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  public createUser(data: CreateUserDto): Promise<UserDocument> {
    const user = new this.UserModel(data);

    return user.save();
  }

  public getAllUsers(): Promise<UserDocument[]> {
    return this.UserModel.find().exec();
  }

  public updateUser(id: string, data: UpdateUserDto): Promise<UserDocument> {
    return this.UserModel.findOneAndUpdate(
      { _id: id },
      data,
    );
  }

  public deleteUser(id: string): Promise<UserDocument> {
    return this.UserModel.findOneAndDelete({ _id: id });
  }



  public createHotel(data: CreateHotelDto): Promise<HotelDocument> {
    const hotel = new this.HotelModel(data);

    return hotel.save();
  }

  public getAllHotels(): Promise<HotelDocument[]> {
    return this.HotelModel.find().exec();
  }

  public updateHotel(id: string, data: UpdateHotelDto): Promise<HotelDocument> {
    return this.HotelModel.findOneAndUpdate(
      { _id: id },
      data,
    );
  }

  public deleteHotel(id: string): Promise<HotelDocument> {
    return this.HotelModel.findOneAndDelete({ _id: id });
  }
}
