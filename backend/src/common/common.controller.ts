import { Body, Controller, Get, Post } from '@nestjs/common';
import { HotelDocument } from 'src/schemas/hotel.schema';
import { CommonService } from './common.service';
import { MessageDocument } from 'src/schemas/message.schema';
import { CreateMessageDto } from 'src/interfaces/dto/create-message';

@Controller('/api/common')
export class CommonController {
  constructor (private readonly commonService: CommonService) {}

  @Get('/hotels')
  public getAllHotels(): Promise<HotelDocument[]> {
    return this.commonService.getAllHotels();
  }

  @Get('/hotel/rooms')
  public getAllRooms(): Promise<HotelDocument[]> {
    return this.commonService.getAllRooms();
  }

  @Get('/hotel/rooms/:id')
  public getRoomInfo(): Promise<HotelDocument[]> {
    return this.commonService.getAllHotels();
  }

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
  }
}
