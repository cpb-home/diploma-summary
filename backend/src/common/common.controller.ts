import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { CommonService } from './common.service';
import { IDates, IparamId, IparamIdWithDates } from 'src/interfaces/param-id';
import { Types } from 'mongoose';
import makeRoomWithHotelInfo from 'src/functions/makeRoomWithHotelInfo';
import { ResponseUserDto } from 'src/interfaces/dto/response-user';
import { GetUserDto } from 'src/interfaces/dto/get-user';
import { toUserDto } from 'src/functions/toResponseUserDto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { createReadStream } from 'fs';
import { ResponeSupportMessage } from 'src/interfaces/dto/response-supportMessage';
import { Roles, RolesGuard } from 'src/validation/rolesGuard';
import { ResponseRoomWithHotelDto } from 'src/interfaces/dto/response-roomWithHotel';
import { ResponseHotelDto } from 'src/interfaces/dto/response-hotel';
import { ReplyMessageDto } from 'src/interfaces/dto/replyMessage.dto';
import { CreateMessageDto } from 'src/interfaces/dto/create-message';
import { RequestTextDto } from 'src/interfaces/dto/request-text';

@Controller('/api/common')
export class CommonController {
  constructor (private readonly commonService: CommonService) {}

  @Get('/hotels')
  public async getAllHotels(): Promise<ResponseHotelDto[]> {
    const allHotels = await this.commonService.getAllHotels();
    const allHotelsForFront: ResponseHotelDto[] = [];

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

  @Get('/hotel-rooms/:startDate/:finDate')
  public async getAllRooms(@Param() { startDate, finDate }: IDates): Promise<ResponseRoomWithHotelDto[]> {
    const sendRoomsList: ResponseRoomWithHotelDto[] = [];
    const allRooms = await this.commonService.getAllRooms(startDate, finDate);

    for (const room of allRooms) {
      sendRoomsList.push(await makeRoomWithHotelInfo(this.commonService, room));
    }

    return sendRoomsList;
  }

  @Get('/hotel-rooms/:id')
  public async getRoomInfo(@Param() { id }: IparamId): Promise<ResponseRoomWithHotelDto> {
    const idObjectId = new Types.ObjectId(id);
    const currentRoom = await this.commonService.getRoomInfo(idObjectId);
    if (currentRoom) {
      return await makeRoomWithHotelInfo(this.commonService, currentRoom)
    }
    return null;
  }

  @Get('/hotel/:id')
  public async getHotelInfo(@Param() { id }: IparamId): Promise<ResponseHotelDto> {
    const idObjectId = new Types.ObjectId(id);
    const currentHotel = await this.commonService.getHotelInfo(idObjectId);
    if (currentHotel) {
      return {id: currentHotel._id.toString(), title: currentHotel.title, description: currentHotel.description};
    }
    return null;
  }

  @Get('/hotels/:id/rooms/:startDate/:finDate') //
  public async getAvailableRoomsForHotel(@Param() { id, startDate, finDate }: IparamIdWithDates): Promise<ResponseRoomWithHotelDto[]> {
    const idObjectId = new Types.ObjectId(id);
    const hotelRooms = await this.commonService.getAvailableRoomsForHotel(idObjectId, startDate, finDate);
    const sendHotelRoomsList: ResponseRoomWithHotelDto[] = [];

      for (const room of hotelRooms) {
        sendHotelRoomsList.push(await makeRoomWithHotelInfo(this.commonService, room));
      }

    return sendHotelRoomsList;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/:id')
  public async getUserInfo(@Param() { id }: IparamId): Promise<ResponseUserDto> {
    const idObjectId = new Types.ObjectId(id);
    const user: GetUserDto = await this.commonService.getUserInfo(idObjectId);
    return toUserDto(user);
  }


  //@UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/support-requests/:id/messages')
  //@Roles('client', 'manager')
  public async getAllmessages(@Param() { id }: IparamId): Promise<ResponeSupportMessage[]> {
    const userId = new Types.ObjectId(id);
    const userChat = await this.commonService.getUserChat(userId);
    const messagesList: ResponeSupportMessage[] = [];

    if (userChat) {
      for (const message of userChat.messages) {
        const messageInfo = await this.commonService.getMessage(message);
        const currentMessage = {
          id: messageInfo._id.toString(),
          createdAt: messageInfo.sentAt.toISOString(),
          text: messageInfo.text,
          readAt: messageInfo.readAt.toISOString(),
          author: {
            id: userId.toString(),
            name: (await this.commonService.getUserInfo(userId)).name
          }
        }
        messagesList.push(currentMessage);
      }
    }

    return messagesList;
  }

  //@UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/support-requests/:id/messages')
  //@Roles('client', 'manager')
  public async sendMessage(@Body() body: RequestTextDto, @Param() { id }: IparamId): Promise<ReplyMessageDto> {
    const userId = new Types.ObjectId(id);
    const supportReqest = await this.commonService.getSupportRequest(userId);
    let result = false;

    if (supportReqest) {
      const addMessage = await this.commonService.addMessage(body, userId, supportReqest);
      if (addMessage) {
        result = true;
      } else {
        result = false;
      }
    } else {
      const createMessage = await this.commonService.createSupportRequest(body, userId);
      if (createMessage) {
        result = true;
      } else {
        result = false;
      }
    }
    
    if (result) {
      return { message: 'Сообщение успешно отправлено', statusCode: 200 };
    }
    return { message: 'Не удалось отправить сообщение', statusCode: 400 };
  }

  //@UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/support-requests/:id/messages/read')
  //@Roles('client', 'manager')
  public async markMessageRead(@Param() { id }: IparamId): Promise<ReplyMessageDto> {
    const messageId = new Types.ObjectId(id);

    if (await this.commonService.markMessageRead(messageId)) {
      return { message: 'Сообщение отмечено прочитанным', statusCode: 200 }
    }
    return { message: 'Не удалось отметить сообщение прочитанным', statusCode: 400 }
  }

  @Get('/files/:filePath')
  getFile(@Param('filePath') filePath: string, @Res() res) {
    const file = createReadStream(`./uploads/${filePath}`);
    file.pipe(res);
  }
}
