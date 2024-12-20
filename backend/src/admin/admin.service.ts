import { HttpException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import { Connection, Model, Types } from 'mongoose';
import { join } from 'path';
import * as fs from 'fs/promises';
import { toUserDto } from 'src/functions/toResponseUserDto';
import { CreateHotelDto } from 'src/interfaces/dto/create-hotel';
import { CreateRoomDto } from 'src/interfaces/dto/create-room';
import { CreateUserDto } from 'src/interfaces/dto/create-user';
import { UpdateHotelDto } from 'src/interfaces/dto/update-hotel';
import { UpdateRoomDto } from 'src/interfaces/dto/update-room';
import { UpdateUserDto } from 'src/interfaces/dto/update-user';
import { ResponseUserDto } from 'src/interfaces/dto/response-user';
import { GetUserDto } from 'src/interfaces/dto/get-user';
import { Hotel, HotelDocument } from 'src/schemas/hotel.schema';
import { HotelRoom, HotelRoomDocument } from 'src/schemas/hotelRoom.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { GetHotelDto } from 'src/interfaces/dto/get-hotel';
import { GetRoomDto } from 'src/interfaces/dto/get_room';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
    @InjectModel(HotelRoom.name) private HotelRoomModel: Model<HotelRoomDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  public async createUser(data: CreateUserDto): Promise<ResponseUserDto> {
    if (await this.UserModel.findOne({email: data.email})) {
      throw new HttpException('Такой пользователь уже существует', 400)
    }
    const salt = await genSalt(10);
    const passwordHash = await hash(data.password, salt);

    const user = new this.UserModel({
      email: data.email,
      passwordHash,
      name: data.name,
      role: data.role,
      contactPhone: data.contactPhone
    });
    
    const result: GetUserDto = await user.save();

    return toUserDto(result);
  }

  public async getAllUsers(): Promise<GetUserDto[]> {
    return await this.UserModel.find().exec();
  }

  public updateUser(id: string, data: UpdateUserDto): Promise<GetUserDto> {
    return this.UserModel.findOneAndUpdate(
      { _id: id },
      data,
    );
  }

  public deleteUser(id: string): Promise<GetUserDto> {
    return this.UserModel.findOneAndDelete({ _id: id });
  }

  public async getUserInfo(email: string): Promise<GetUserDto> {
    return this.UserModel.findOne({email});
  }

  public async createHotel(data: CreateHotelDto): Promise<GetHotelDto> {
    
    const hotel = new this.HotelModel(data);
    hotel.createdAt = new Date();
    hotel.updatedAt = new Date();

    return await hotel.save();
  }

  public getAllHotels(): Promise<GetHotelDto[]> {
    return this.HotelModel.find().exec();
  }

  public async updateHotel(id: Types.ObjectId, data: UpdateHotelDto): Promise<GetHotelDto> {
    const hotel = await this.HotelModel.findOneAndUpdate(
      { _id: id },
      { $set: {description: data.description, updatedAt: new Date()} },
    );
    return hotel;
  }


  public async createRoom(data: CreateRoomDto): Promise<GetRoomDto> {
    const room = new this.HotelRoomModel(data);
    room.createdAt = new Date();
    room.updatedAt = new Date();
    room.isEnabled = true;
    const result = await room.save();

    return result;
  }

  public async updateRoom(id: Types.ObjectId, data: UpdateRoomDto): Promise<GetRoomDto> {
    const room = await this.HotelRoomModel.findOneAndUpdate(
      { _id: id },
      { $set: {description: data.description, updatedAt: new Date()} },
    );
    return room;
  }

  async saveFile(tempPath: string, fileName: string): Promise<void> {
    const uploadsDir = join(process.cwd(), 'uploads');
    await fs.rename(tempPath, join(uploadsDir, fileName));
  }
}
