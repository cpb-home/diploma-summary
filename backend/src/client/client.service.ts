import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateReservationDto } from 'src/interfaces/dto/create-reservation';
import { Hotel, HotelDocument } from 'src/schemas/hotel.schema';
import { HotelRoom, HotelRoomDocument } from 'src/schemas/hotelRoom.schema';
import { Reservation, ReservationDocument } from 'src/schemas/reservation.schema';
import { GetUserDto } from 'src/interfaces/dto/get-user';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateUserDto } from 'src/interfaces/dto/create-user';
import { ResponseUserDto } from 'src/interfaces/dto/response-user';
import { genSalt, hash } from 'bcrypt';
import { toUserDto } from 'src/functions/toResponseUserDto';
import { ResponseReservationDto } from 'src/interfaces/dto/response-reservation';
import { GetHotelDto } from 'src/interfaces/dto/get-hotel';
import { GetRoomDto } from 'src/interfaces/dto/get_room';
import { GetReservationDto } from 'src/interfaces/dto/get-reservation';
import { SupportRequest, SupportRequestDocument } from 'src/schemas/supportRequest.schema';
import { GetSupportRequestDto } from 'src/interfaces/dto/get-supportRequest';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Reservation.name) private ReservationModel: Model<ReservationDocument>,
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
    @InjectModel(HotelRoom.name) private HotelRoomModel: Model<HotelRoomDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(SupportRequest.name) private SupportrequestModel: Model<SupportRequestDocument>,
  ) {}

  public async getUserBookings(userId: Types.ObjectId): Promise<ResponseReservationDto[]> {
    const bookings: GetReservationDto[] = await this.ReservationModel.find({userId: userId});
    const reservationsForFront: ResponseReservationDto[] = [];

    for (const booking of bookings) {
      const hotel: GetHotelDto = await this.HotelModel.findOne({_id: new Types.ObjectId(booking.hotelId)});
      const room: GetRoomDto = await this.HotelRoomModel.findOne({_id: new Types.ObjectId(booking.roomId)});
      const item: ResponseReservationDto = {
        id: booking._id.toString(),
        hotel: {
          id: hotel._id.toString(),
          title: hotel.title,
          description: hotel.description,
        },
        hotelRoom: {
          description: room.description,
          images: room.images,
        },
        startDate: (booking.dateStart).toString(),
        endDate: (booking.dateEnd).toString(),
      }
      reservationsForFront.push(item);
    }
    
    return reservationsForFront;
  }

  public async createBooking(data: CreateReservationDto): Promise<GetReservationDto> {
    const booking = new this.ReservationModel(data);
    return await booking.save();
  }

  public async deleteBooking(id: Types.ObjectId): Promise<any> {
    return await this.ReservationModel.deleteOne({_id: id});
  }

  public async registerUser(data: CreateUserDto): Promise<ResponseUserDto> {
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

  public async getSupportMessagesList(id): Promise<GetSupportRequestDto> {
    return await this.SupportrequestModel.findOne({_id: id});
  }
}
