import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { HotelDocument } from 'src/schemas/hotel.schema';
import { CommonService } from './common.service';
import { MessageDocument } from 'src/schemas/message.schema';
import { CreateMessageDto } from 'src/interfaces/dto/create-message';
import { HotelRoomDocument } from 'src/schemas/hotelRoom.schema';
import { IDates, IparamId, IparamIdWithDates } from 'src/interfaces/param-id';
import { IHotelsListItem, IRoomListItem } from 'src/interfaces/param-hotelsWithRooms';
import makeRoomWithHotelInfo from 'src/functions/makeRoomWithHotelInfo';

@Controller('/api/common')
export class CommonController {
  constructor (private readonly commonService: CommonService) {}

  @Get('/hotels') //COMMON_HOTELS_LIST = все гостиницы. Включены номера, которые isEnabled
  public async getAllHotels(): Promise<IHotelsListItem[]> {
    const allHotels = await this.commonService.getAllHotels();
    const sendHotelsList: IHotelsListItem[] = [];

    for (const hotel of allHotels) {
      const updatedHotel = {
        _id: hotel._id.toString(),
        title: hotel.title,
        description: hotel.description,
        createdAt: hotel.createdAt,
        updatedAt: hotel.updatedAt,
        availableRooms: [],
      };
      const roomsForHotel = await this.commonService.getAvailableRoomsForHotel((hotel._id).toString())
      roomsForHotel.forEach(room => updatedHotel.availableRooms.push({
        _id: room._id.toString(),
        description: room.description,
        images: room.images,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
        isEnabled: room.isEnabled,
        hotel: {_id: hotel._id.toString(), title: hotel.title, description: hotel.description}
      }));
      sendHotelsList.push(updatedHotel);
    }
    return sendHotelsList;
  }

  @Get('/hotel/rooms/:startDate/:finDate') //COMMON_ROOMS_LIST = все номера. Включены все номера, которые isEnabled
  public async getAllRooms(@Param() { startDate, finDate }: IDates): Promise<IRoomListItem[]> {
    const sendRoomsList: IRoomListItem[] = [];
    const allRooms = await this.commonService.getAllAvailableRooms(startDate, finDate);
/*
    for (const room of allRooms) {
      const hotel = await this.commonService.getHotelInfo(room.hotel.toString());
      const updatedRoom: IRoomListItem = {
        _id: room._id.toString(),
        description: room.description,
        images: room.images,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
        isEnabled: room.isEnabled,
        hotel: {_id: hotel._id.toString(), title: hotel.title, description: hotel.description}
      } 
      console.log(updatedRoom);
      sendRoomsList.push(updatedRoom);
    }*/
    for (const room of allRooms) {
      sendRoomsList.push(await makeRoomWithHotelInfo(this.commonService, room, room.hotel.toString()));
    }

    return sendRoomsList;
  }

  @Get('/hotel/rooms/:id') // VITE_COMMON_ROOM_INFO = инфо о номере. 
  public async getRoomInfo(@Param() { id }: IparamId): Promise<IRoomListItem> {
    const currentRoom = await this.commonService.getRoomInfo(id);
    if (currentRoom) {
      return await makeRoomWithHotelInfo(this.commonService, currentRoom, currentRoom.hotel.toString())
    }
    return null;
  }

  @Get('/hotels/:id/rooms/:startDate/:finDate') //COMMON_HOTEL_ROOMS_LIST
  public async getAvailableRoomsForHotel(@Param() { id, startDate, finDate }: IparamIdWithDates): Promise<IRoomListItem[]> {
    const hotelRooms = await this.commonService.getAvailableRoomsForHotel(id, startDate, finDate);
    const sendHotelRoomsList: IRoomListItem[] = [];
/*
    for (const room of hotelRooms) {
      const hotel = await this.commonService.getHotelInfo(room.hotel.toString());
      const updatedRoom: IRoomListItem = {
        _id: room._id.toString(),
        description: room.description,
        images: room.images,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
        isEnabled: room.isEnabled,
        hotel: {_id: hotel._id.toString(), title: hotel.title, description: hotel.description}
      } 
      await makeRoomWithHotelInfo(this.commonService, room, room.hotel.toString());
      sendHotelRoomsList.push(updatedRoom);
    }*/

      for (const room of hotelRooms) {
        sendHotelRoomsList.push(await makeRoomWithHotelInfo(this.commonService, room, room.hotel.toString()));
      }

    return sendHotelRoomsList;
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
