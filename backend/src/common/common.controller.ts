import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { HotelDocument } from 'src/schemas/hotel.schema';
import { CommonService } from './common.service';
import { MessageDocument } from 'src/schemas/message.schema';
import { CreateMessageDto } from 'src/interfaces/dto/create-message';
import { HotelRoomDocument } from 'src/schemas/hotelRoom.schema';
import { IparamId } from 'src/interfaces/param-id';
import { IHotelsListItem } from 'src/interfaces/param-hotelsWithRooms';

@Controller('/api/common')
export class CommonController {
  constructor (private readonly commonService: CommonService) {}

  @Get('/hotels') //COMMON_HOTELS_LIST
  public async getAllHotels(): Promise<IHotelsListItem[]>/*Promise<HotelDocument[]>*/ {
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
      const roomsForHotel = await this.commonService.getExistedRoomsForHotel((hotel._id).toString())
      roomsForHotel.forEach(room => updatedHotel.availableRooms.push({
        _id: room._id.toString(),
        description: room.description,
        images: room.images,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
        isEnabled: room.isEnabled,
        hotel: {_id: hotel._id, title: hotel.title, description: hotel.description}
      }));
      sendHotelsList.push(updatedHotel);
    }
    return sendHotelsList;
  }

  @Get('/hotel/rooms') //COMMON_ROOMS_LIST
  public getAllRooms(): Promise<HotelRoomDocument[]> {
    return this.commonService.getAllRooms();
  }

  @Get('/hotel/rooms/:id')
  public getRoomInfo(@Param() { id }: IparamId): Promise<HotelRoomDocument> {
    return this.commonService.getRoomInfo(id);
  }

  @Get('/hotels/:id/rooms') //COMMON_HOTEL_ROOMS_LIST
  public async getAvailableRoomsForHotel(@Param() { id }: IparamId): Promise<HotelRoomDocument[]> {
    return await this.commonService.getAvailableRoomsForHotel(id);
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
