import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { FromBaseHotel } from 'src/interfaces/fromBaseHotel';
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
  ) {}

  public async getAllHotels(): Promise<FromBaseHotel[]> {
    return await this.HotelModel.find();
  }

  public async getHotelInfo(id: Types.ObjectId): Promise<FromBaseHotel> {
    return await this.HotelModel.findOne({_id: id});
  }

  public async getAllRooms(startDate?: Date, finDate?: Date): Promise<HotelRoomDocument[]> {
    console.log('from getAllRooms', startDate, finDate);
    const allRooms = await this.HotelRoomModel.find().exec();
/*
    db.collection.find({
      $or: [
        { dateStart: { $gt: endDate } },
        { dateEnd:   { $lt: startDate } }
      ]
    });

    Оператор $or проверяет выполнение хотя бы одного из двух условий:
Первое условие { dateStart: { $gt: endDate } }: дата начала должна быть позже указанной конечной даты endDate.
Второе условие { dateEnd: { $lt: startDate } }: дата окончания должна быть раньше указанной начальной даты startDate.
Таким образом, если оба условия выполняются одновременно, это означает, что указанный диапазон полностью лежит вне периода занятости данного документа.

Если ваши переменные startDate и endDate уже определены, то можно вставить их прямо в запрос:


const startDate = new Date('2023-10-01');
const endDate = new Date('2023-10-15');

db.collection.find({
  $or: [
    { dateStart: { $gt: endDate } },
    { dateEnd:   { $lt: startDate } }
  ]
});
Этот запрос вернет все документы, периоды которых не пересекаются с интервалом от startDate до endDate, т.е. они будут доступны для бронирования в этот промежуток времени.
*/

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

  public async getUserInfo(id: Types.ObjectId): Promise<FromBaseUser> {
    return await this.UserModel.findOne({_id: id});
  }



  public async getExistedRoomsForHotel(hotelId: string): Promise<HotelRoomDocument[]> {
    return await this.HotelRoomModel.find({hotel: hotelId});;
  }
}
