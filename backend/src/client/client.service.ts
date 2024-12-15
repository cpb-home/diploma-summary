import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateReservationDto } from 'src/interfaces/dto/create-reservation';
import { FromBaseBooking } from 'src/interfaces/fromBaseReservations';
import { Hotel, HotelDocument } from 'src/schemas/hotel.schema';
import { HotelRoom, HotelRoomDocument } from 'src/schemas/hotelRoom.schema';
import { Reservation, ReservationDocument } from 'src/schemas/reservation.schema';
import { IReservationItemForFront } from 'src/interfaces/param-reservations';
import { FromBaseUser } from 'src/interfaces/fromBaseUser';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateUserDto } from 'src/interfaces/dto/create-user';
import { UserDto } from 'src/interfaces/dto/user.dto';
import { genSalt, hash } from 'bcrypt';
import { toUserDto } from 'src/functions/toDtoFormat';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Reservation.name) private ReservationModel: Model<ReservationDocument>,
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
    @InjectModel(HotelRoom.name) private HotelRoomModel: Model<HotelRoomDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
  ) {}

  public async getUserBookings(userId: Types.ObjectId): Promise<IReservationItemForFront[]> {
    const bookings: FromBaseBooking[] = await this.ReservationModel.find({userId: userId});
    const reservationsForFront: IReservationItemForFront[] = [];

    for (const booking of bookings) {
      const hotel: HotelDocument = await this.HotelModel.findOne({_id: new Types.ObjectId(booking.hotelId)});
      const room: HotelRoomDocument = await this.HotelRoomModel.findOne({_id: new Types.ObjectId(booking.roomId)});
      const item = {
        id: booking._id.toString(),
        hotel: {
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

  public async createBooking(data: CreateReservationDto): Promise<ReservationDocument> {
    const booking = new this.ReservationModel(data);
    return await booking.save();
  }

  public async deleteBooking(id: Types.ObjectId): Promise<any> {
    return await this.ReservationModel.deleteOne({_id: id});
  }

  public async registerUser(data: CreateUserDto): Promise<UserDto> {
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
    
    const result: FromBaseUser = await user.save();

    return toUserDto(result);
  }



  public async getAllUsers(): Promise<FromBaseUser[]> {
    return await this.UserModel.find().exec();
  }
}
