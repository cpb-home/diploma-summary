import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import { Connection, Model } from 'mongoose';
import { toUserDto } from 'src/functions/toUserDto';
import { CreateHotelDto } from 'src/interfaces/dto/create-hotel';
import { CreateRoomDto } from 'src/interfaces/dto/create-room';
import { CreateUserDto } from 'src/interfaces/dto/create-user';
import { UpdateHotelDto } from 'src/interfaces/dto/update-hotel';
import { UpdateUserDto } from 'src/interfaces/dto/update-user';
import { UserDto } from 'src/interfaces/dto/user.dto';
import { FromBaseUser } from 'src/interfaces/fromBaseUser';
import { Hotel, HotelDocument } from 'src/schemas/hotel.schema';
import { HotelRoom, HotelRoomDocument } from 'src/schemas/hotelRoom.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
    @InjectModel(HotelRoom.name) private HotelRoomModel: Model<HotelRoomDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  public async createUser(data: CreateUserDto): Promise<UserDto> {
    if (await this.UserModel.findOne({email: data.email})) {
      throw new HttpException('Такой пользователь уже существует', 400)
    }
    const salt = await genSalt(10);
    const passwordHash = await hash(data.passwordHash, salt);

    //const user = new this.UserModel(data);
    //const result = await user.save();

    const user = new this.UserModel({
      email: data.email,
      passwordHash,
      name: data.name,
      role: data.role,
      contactPhone: data.contactPhone
    });
    
    const result: FromBaseUser = await user.save();

    return toUserDto(result);
  }

  public async getAllUsers(): Promise<UserDocument[]> {
    return await this.UserModel.find().exec();
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
    hotel.createdAt = new Date();
    hotel.updatedAt = new Date();

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


  public async createRoom(data: CreateRoomDto): Promise<HotelRoomDocument> {
    const room = new this.HotelRoomModel(data);
    const result = await room.save();

    return result;
  }

  public updateRoomInfo() {

  }
}
