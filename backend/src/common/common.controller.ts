import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { HotelDocument } from 'src/schemas/hotel.schema';
import { CommonService } from './common.service';
import { MessageDocument } from 'src/schemas/message.schema';
import { CreateMessageDto } from 'src/interfaces/dto/create-message';
import { HotelRoomDocument } from 'src/schemas/hotelRoom.schema';
import { IDates, IparamEmail, IparamId, IparamIdWithDates } from 'src/interfaces/param-id';
import { IHotelsListItem, IHotelsListItemForFront, IRoomListItemForFront } from 'src/interfaces/param-hotelsWithRooms';
import { Types } from 'mongoose';
import makeRoomWithHotelInfo from 'src/functions/makeRoomWithHotelInfo';
import { UserDto } from 'src/interfaces/dto/user.dto';
import { FromBaseUser } from 'src/interfaces/fromBaseUser';
import { toUserDto } from 'src/functions/toDtoFormat';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

@Controller('/api/common')
export class CommonController {
  constructor (private readonly commonService: CommonService) {}

  @Get('/hotels') //COMMON_HOTELS_LIST = все гостиницы
  public async getAllHotels(): Promise<IHotelsListItemForFront[]> {
    const allHotels = await this.commonService.getAllHotels();
    const allHotelsForFront: IHotelsListItemForFront[] = [];

    for (const hotel of allHotels) {
      const returnHotel = {
        id: hotel._id.toString(),
        title: hotel.title,
        description: hotel.description ? hotel.description : 'Нет описания',
      }
      allHotelsForFront.push(returnHotel);
    }

    return allHotelsForFront;
  }

  @Get('/hotel-rooms/:startDate/:finDate') //COMMON_ROOMS_LIST = все номера. Включены все номера, которые isEnabled
  public async getAllRooms(@Param() { startDate, finDate }: IDates): Promise<IRoomListItemForFront[]> {
    const sendRoomsList: IRoomListItemForFront[] = [];
    const allRooms = await this.commonService.getAllRooms(startDate, finDate);

    for (const room of allRooms) {
      sendRoomsList.push(await makeRoomWithHotelInfo(this.commonService, room));
    }

    return sendRoomsList;
  }

  @Get('/hotel-rooms/:id') // VITE_COMMON_ROOM_INFO = инфо о номере. 
  public async getRoomInfo(@Param() { id }: IparamId): Promise<IRoomListItemForFront> {
    const idObjectId = new Types.ObjectId(id);
    const currentRoom = await this.commonService.getRoomInfo(idObjectId);
    if (currentRoom) {
      return await makeRoomWithHotelInfo(this.commonService, currentRoom)
    }
    return null;
  }

  @Get('/hotels/:id/rooms/:startDate/:finDate') //COMMON_HOTEL_ROOMS_LIST
  public async getAvailableRoomsForHotel(@Param() { id, startDate, finDate }: IparamIdWithDates): Promise<IRoomListItemForFront[]> {
    const idObjectId = new Types.ObjectId(id);
    const hotelRooms = await this.commonService.getAvailableRoomsForHotel(idObjectId, startDate, finDate);
    const sendHotelRoomsList: IRoomListItemForFront[] = [];

      for (const room of hotelRooms) {
        sendHotelRoomsList.push(await makeRoomWithHotelInfo(this.commonService, room));
      }

    return sendHotelRoomsList;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/:email')
  public async getUserInfo(@Param() { email }: IparamEmail): Promise<UserDto> {
    const user: FromBaseUser = await this.commonService.getUserInfo(email);
    return toUserDto(user);
  }


/*
  @Get('/support-requests/:id/messages')
  public getAllmessages(): Promise<HotelDocument[]> {
    return this.commonService.getAllHotels();
  }

  @Post('/support-requests/:id/messages')
  public sendMessage(@Body() body: CreateMessageDto): Promise<MessageDocument> {
    return this.MessageService.createUser(body);
  }

  @Post('/support-requests/:id/messages/read')
  public makeMessageRead(@Body() body: CreateMessageDto): Promise<MessageDocument> {
    return this.MessageService.createUser(body);
  }*/
}
