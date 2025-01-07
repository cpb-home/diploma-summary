import { Body, Controller, Get, HttpException, Param, Post, Res, UseGuards } from '@nestjs/common';
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
import { ResponseUserWithCountDto } from 'src/interfaces/dto/response-userWithCount';
import { RequestMsgsForRead } from 'src/interfaces/dto/request-msgsForRead';

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


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/support-requests/:id/messages')
  @Roles('client', 'manager')
  public async getAllmessages(@Param() { id }: IparamId): Promise<ResponeSupportMessage[]> {
    const userId = new Types.ObjectId(id);
    const userChat = await this.commonService.getUserChat(userId);
    const messagesList: ResponeSupportMessage[] = [];

    if (userChat) {
      for (const message of userChat.messages) {
        const messageInfo = await this.commonService.getMessage(message);
        const userInfo = await this.commonService.getUserInfo(messageInfo.author);
        const currentMessage = {
          id: messageInfo._id.toString(),
          sentAt: messageInfo.sentAt.toString(),
          text: messageInfo.text,
          readAt: messageInfo.readAt? messageInfo.readAt.toString() : '',
          author: {
            id: userInfo._id.toString(),
            name: userInfo.name
          }
        }
        messagesList.push(currentMessage);
      }
    }

    return messagesList;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/support-requests/:id/messages')
  @Roles('client', 'manager')
  public async sendMessage(@Body() body: RequestTextDto, @Param() { id }: IparamId): Promise<ReplyMessageDto> {
    const currentUserId = new Types.ObjectId(id);
    try {
      const addedMessage = await this.commonService.addMessage(body, new Types.ObjectId(currentUserId));

      if (body.replyUserId) {
        const supportReqest = await this.commonService.getSupportRequest(new Types.ObjectId(body.replyUserId));
        if (supportReqest) {
          await this.commonService.addMessageToSupportRequest(new Types.ObjectId(String(supportReqest._id)), new Types.ObjectId(String(addedMessage._id)));
        }
      } else {
        const supportReqest = await this.commonService.getSupportRequest(currentUserId);
        if (supportReqest) {
          await this.commonService.addMessageToSupportRequest(new Types.ObjectId(String(supportReqest._id)), new Types.ObjectId(String(addedMessage._id)));
        } else {
          await this.commonService.createSupportRequest(new Types.ObjectId(String(addedMessage._id)), currentUserId);
        }
      }

      return { message: 'Сообщение успешно отправлено', statusCode: 200 };
    } catch (e) {
      throw new HttpException('Не удалось создать сообщение: ' + e, 400);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/support-requests/:id/messages/read')
  @Roles('client', 'manager')
  public async markMessageRead(@Param() { id }: IparamId): Promise<ReplyMessageDto> {
    const messageId = new Types.ObjectId(id);

    if (await this.commonService.markMessageRead(messageId)) {
      return { message: 'Сообщение отмечено прочитанным', statusCode: 200 }
    }
    return { message: 'Не удалось отметить сообщение прочитанным', statusCode: 400 }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/support-requests/makeMessages/read')
  @Roles('client', 'manager')
  public async markManyMessageRead(@Body() body: RequestMsgsForRead): Promise<ReplyMessageDto> {
    let result = true;

    for (const msg of body.msgsList) {
      if ((await this.markMessageRead({id: msg})).statusCode === 400) {
        result = false;
      }
    }

    if (result) {
      return { message: 'Сообщения отмечены прочитанными', statusCode: 200 }
    }
    return { message: 'Не удалось отметить сообщения прочитанными', statusCode: 400 }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/support-requests/users')
  @Roles('client', 'manager')
  public async getAllSupportUsers(): Promise<ResponseUserDto[]> {
    const allRequests = await this.commonService.getAllRequests();
    allRequests.sort((a, b) => {
      return (a === b) ? 0 : a ? -1 : 1;
    } )
    const users: ResponseUserDto[] = [];
    
    for (const request of allRequests) {
      const user = await this.commonService.getUserInfo(request.user);
      if (user) {
          const usersItem = {
          id: request.user,
          email: user.email,
          role: user.role,
          name: user.name,
          contactPhone: user.contactPhone
        }
        users.push(usersItem);
      }
    }
    
    return users;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/support-requests/usersWithUnread')
  @Roles('client', 'manager')
  public async getAllSupportUsersWithUnread(): Promise<ResponseUserWithCountDto[]> {
    const allSupportUsers = await this.getAllSupportUsers();
    const usersWithCount: ResponseUserWithCountDto[] = [];
    
    if (allSupportUsers) {
      for (const user of allSupportUsers) {
        const count = await this.getUserUnreadCount({id: String(user.id)});
        const newInfo = {
          id: user.id,
          name: user.name,
          unreadCount: count        
        }
        usersWithCount.push(newInfo);
      }
    }

    return usersWithCount;
  }

  @Get('/files/:filePath')
  getFile(@Param('filePath') filePath: string, @Res() res) {
    const file = createReadStream(`./uploads/${filePath}`);
    file.pipe(res);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/support-requests/user/:id/unread')
  @Roles('client', 'manager')
  public async getUserUnreadCount(@Param() { id }: IparamId): Promise<number> {
    const userId = new Types.ObjectId(id);
    return this.commonService.getUserUnreadCount(userId);
  }
}
