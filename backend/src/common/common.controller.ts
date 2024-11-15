import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { HotelDocument } from 'src/schemas/hotel.schema';
import { CommonService } from './common.service';
import { MessageDocument } from 'src/schemas/message.schema';
import { CreateMessageDto } from 'src/interfaces/dto/create-message';
import { HotelRoomDocument } from 'src/schemas/hotelRoom.schema';
import { IparamId } from 'src/interfaces/param-id';
import { IHotelWithRooms } from 'src/interfaces/param-hotelsWithRooms';

@Controller('/api/common')
export class CommonController {
  constructor (private readonly commonService: CommonService) {}

  @Get('/hotels')
  public async getAllHotels(): Promise<IHotelWithRooms[]>/*Promise<HotelDocument[]>*/ {
    const allHotels = await this.commonService.getAllHotels();
    const sendHotelsList: IHotelWithRooms[] = [];

    for (const hotel of allHotels) {
      console.log('start');
      const updatedHotel = {
        _id: hotel._id,
        title: hotel.title,
        description: hotel.description,
        createdAt: hotel.createdAt,
        updatedAt: hotel.updatedAt,
        availableRooms: (await this.commonService.getAvailableRoomsForHotel((hotel._id).toString()))
      };
      console.log('end');
      // const roomsForHotel = await this.commonService.getAvailableRoomsForHotel(allHotels[i]._id as string);console.log(roomsForHotel.length);
      // roomsForHotel.forEach(room => updatedHotel.availableRooms.push(room));
      sendHotelsList.push(updatedHotel);
    }
    //console.log(sendHotelsList);
    return sendHotelsList;
    //return allHotels;
  }

  @Get('/hotel/rooms')
  public getAllRooms(): Promise<HotelRoomDocument[]> {
    return this.commonService.getAllRooms();
  }

  @Get('/hotel/rooms/:id')
  public getRoomInfo(@Param() { id }: IparamId): Promise<HotelRoomDocument> {
    return this.commonService.getRoomInfo(id);
  }

  @Get('/hotels/:id/rooms')
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
