import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { FromBaseHotel } from 'src/interfaces/fromBaseHotel';
import { FromBaseBooking } from 'src/interfaces/fromBaseReservations';
import { FromBaseRooms } from 'src/interfaces/fromBaseRooms';
import { FromBaseUser } from 'src/interfaces/fromBaseUser';
import { Hotel, HotelDocument } from 'src/schemas/hotel.schema';
import { HotelRoom, HotelRoomDocument } from 'src/schemas/hotelRoom.schema';
import { Reservation, ReservationDocument } from 'src/schemas/reservation.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class CommonService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
    @InjectModel(HotelRoom.name) private HotelRoomModel: Model<HotelRoomDocument>,
    @InjectModel(Reservation.name) private ReservationModel: Model<ReservationDocument>,
  ) {}

  public async getAllHotels(): Promise<FromBaseHotel[]> {
    return await this.HotelModel.find();
  }

  public async getHotelInfo(id: Types.ObjectId): Promise<FromBaseHotel> {
    return await this.HotelModel.findOne({_id: id});
  }

  public async getAllRooms(startDate?: string, finDate?: string): Promise<HotelRoomDocument[]> {

    if (startDate === '0' || finDate === '0') {
      return await this.HotelRoomModel.find().exec();  
    }

    const dateFrom = new Date(startDate);
    const dateTo = new Date(finDate);
    
    let allRooms: HotelRoomDocument[] = await this.HotelRoomModel.find();
    const bookings: FromBaseBooking[] = await this.ReservationModel.find({
      $or: [
        {dateStart: {
          $gt: dateFrom,
          $lt: dateTo
        }},
        {dateEnd: {
          $gt: dateFrom,
          $lt: dateTo
        }}
      ]
    });

    for (const booking of bookings) {
      allRooms = allRooms.filter(e => e._id.toString() !== booking.roomId.toString());
    }

    return allRooms;
  }

  public async getRoomInfo(id: Types.ObjectId): Promise<HotelRoomDocument> {
    return await this.HotelRoomModel.findOne({_id: id});
  }

  public async getAvailableRoomsForHotel(hotelId: Types.ObjectId, startDate?: string, finDate?: string): Promise<HotelRoomDocument[]> {

    if (startDate === '0' || finDate === '0') {
      return await this.HotelRoomModel.find({hotel: hotelId, isEnabled: true});  
    }

    const dateFrom = new Date(startDate);
    const dateTo = new Date(finDate);
    let rooms = await this.HotelRoomModel.find({hotel: hotelId, isEnabled: true});

    const bookings: FromBaseBooking[] = await this.ReservationModel.find({
      $or: [
        {dateStart: {
          $gt: dateFrom,
          $lt: dateTo
        }},
        {dateEnd: {
          $gt: dateFrom,
          $lt: dateTo
        }}
      ]
    });

    for (const booking of bookings) {
      rooms = rooms.filter(e => e._id.toString() !== booking.roomId.toString());
    }

    return rooms;

  }

  public async getUserInfo(id: Types.ObjectId): Promise<FromBaseUser> {
    return await this.UserModel.findOne({_id: id});
  }

  public async getExistedRoomsForHotel(hotelId: string): Promise<HotelRoomDocument[]> {
    return await this.HotelRoomModel.find({hotel: hotelId});;
  }
}
