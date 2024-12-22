import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GetHotelDto } from 'src/interfaces/dto/get-hotel';
import { GetRoomDto } from 'src/interfaces/dto/get_room';
import { GetUserDto } from 'src/interfaces/dto/get-user';
import { Hotel, HotelDocument } from 'src/schemas/hotel.schema';
import { HotelRoom, HotelRoomDocument } from 'src/schemas/hotelRoom.schema';
import { Message, MessageDocument } from 'src/schemas/message.schema';
import { Reservation, ReservationDocument } from 'src/schemas/reservation.schema';
import { SupportRequest, SupportRequestDocument } from 'src/schemas/supportRequest.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { GetReservationDto } from 'src/interfaces/dto/get-reservation';
import { GetSupportRequestDto } from 'src/interfaces/dto/get-supportRequest';
import { GetMessageDto } from 'src/interfaces/dto/get-message';
import { RequestTextDto } from 'src/interfaces/dto/request-text';

@Injectable()
export class CommonService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
    @InjectModel(HotelRoom.name) private HotelRoomModel: Model<HotelRoomDocument>,
    @InjectModel(Reservation.name) private ReservationModel: Model<ReservationDocument>,
    @InjectModel(SupportRequest.name) private SupportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
  ) {}

  public async getAllHotels(): Promise<GetHotelDto[]> {
    return await this.HotelModel.find();
  }

  public async getHotelInfo(id: Types.ObjectId): Promise<GetHotelDto> {
    return await this.HotelModel.findOne({_id: id});
  }

  public async getAllRooms(startDate?: string, finDate?: string): Promise<GetRoomDto[]> {

    if (startDate === '0' || finDate === '0') {
      return await this.HotelRoomModel.find().exec();  
    }

    const dateFrom = new Date(startDate);
    const dateTo = new Date(finDate);
    
    let allRooms: GetRoomDto[] = await this.HotelRoomModel.find();
    const bookings: GetReservationDto[] = await this.ReservationModel.find({
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

    const bookings: GetReservationDto[] = await this.ReservationModel.find({
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

  public async getUserInfo(id: Types.ObjectId): Promise<GetUserDto> {
    return await this.UserModel.findOne({_id: id});
  }

  public async getExistedRoomsForHotel(hotelId: string): Promise<HotelRoomDocument[]> {
    return await this.HotelRoomModel.find({hotel: hotelId});;
  }

  public async getUserChat(id: Types.ObjectId): Promise<SupportRequestDocument> {
    return await this.SupportRequestModel.findOne({user: id});
  }

  public async getMessage(id: Types.ObjectId): Promise<GetMessageDto> {
    return this.MessageModel.findOne({_id: id});
  }

  public async addMessage(body: RequestTextDto, id: Types.ObjectId, supportRequest: GetSupportRequestDto): Promise<any> {
    const message = new this.MessageModel({
      author: id,
      sentAt: new Date(),
      text: body.text,
    });

    const addedMessage = await this.MessageModel.create(message);
    return await this.SupportRequestModel.updateOne({_id: supportRequest._id}, {$push: {messages: addedMessage._id}});
  }

  public async createSupportRequest(body: RequestTextDto, id: Types.ObjectId): Promise<GetSupportRequestDto> {
    const message = new this.MessageModel({
      author: id,
      sentAt: new Date(),
      text: body.text,
      readAt: null
    });
    const addedMessage: GetMessageDto = await this.MessageModel.create(message);
    const supportRequest = new this.SupportRequestModel({
      user: id,
      createdAt: new Date(),
      messages: [addedMessage._id],
      isActive: true,
    });

    return await this.SupportRequestModel.create(supportRequest);
  }

  public async getSupportRequest(id: Types.ObjectId): Promise<GetSupportRequestDto> {
    return await this.SupportRequestModel.findOne({user: id});
  }

  public async markMessageRead(id: Types.ObjectId): Promise<any> {
    return await this.MessageModel.updateOne({_id: id}, {$set: {readAt: new Date()}});
  }

  public async getAllRequests(): Promise<GetSupportRequestDto[]> {
    return await this.SupportRequestModel.find().exec();
  }

  public async getUserUnreadCount(id: Types.ObjectId): Promise<number> {
    const res =  await this.MessageModel.countDocuments({author: id, readAt: null});
    return res;
  }
}
