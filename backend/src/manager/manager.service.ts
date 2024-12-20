import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GetUserDto } from 'src/interfaces/dto/get-user';
import { Hotel, HotelDocument } from 'src/schemas/hotel.schema';
import { HotelRoom, HotelRoomDocument } from 'src/schemas/hotelRoom.schema';
import { Reservation, ReservationDocument } from 'src/schemas/reservation.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { ResponseReservationDto } from 'src/interfaces/dto/response-reservation';
import { GetReservationDto } from 'src/interfaces/dto/get-reservation';
import { GetSupportRequestDto } from 'src/interfaces/dto/get-supportRequest';
import { SupportRequest, SupportRequestDocument } from 'src/schemas/supportRequest.schema';

@Injectable()
export class ManagerService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Reservation.name) private ReservationModel: Model<ReservationDocument>,
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
    @InjectModel(HotelRoom.name) private HotelRoomModel: Model<HotelRoomDocument>,
    @InjectModel(SupportRequest.name) private SupportRequestModel: Model<SupportRequestDocument>,
  ) {}

  public async getAllUsers(): Promise<GetUserDto[]> {
    return await this.UserModel.find({role: 'client'}).exec();
  }

  public async getUserBookings(userId: Types.ObjectId): Promise<ResponseReservationDto[]> {
    const bookings: GetReservationDto[] = await this.ReservationModel.find({userId: userId});
    const reservationsForFront: ResponseReservationDto[] = [];

    for (const booking of bookings) {
      const hotel: HotelDocument = await this.HotelModel.findOne({_id: new Types.ObjectId(booking.hotelId)});
      const room: HotelRoomDocument = await this.HotelRoomModel.findOne({_id: new Types.ObjectId(booking.roomId)});
      const item = {
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

  public async deleteUserBooking(bookingId: Types.ObjectId) {
    return await this.ReservationModel.findOneAndDelete({_id: bookingId});
  }


  public async getAllSupportRequests(): Promise<GetSupportRequestDto[]> {
    return await this.SupportRequestModel.find().exec();
  }
}
