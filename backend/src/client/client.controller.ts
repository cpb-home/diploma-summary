import { Body, Controller, Delete, Get, HttpException, Param, Post, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { IparamId } from 'src/interfaces/param-id';
import { CreateReservationDto } from 'src/interfaces/dto/create-reservation';
import { Types } from 'mongoose';
import { ReplyMessageDto } from 'src/interfaces/dto/replyMessage.dto';
import { Roles, RolesGuard } from 'src/validation/rolesGuard';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CreateUserDto } from 'src/interfaces/dto/create-user';
import { ResponseReservationDto } from 'src/interfaces/dto/response-reservation';
import { GetSupportRequestDto } from 'src/interfaces/dto/get-supportRequest';

@Controller('/api/client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/reservations/:id')
  @Roles('client')
  public async getUserBookings(@Param() { id }: IparamId): Promise<ResponseReservationDto[]> {
    const userId = new Types.ObjectId(id);
    const reservations = await this.clientService.getUserBookings(userId);

    return reservations;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/reservations')
  @Roles('client')
  public async createBooking(@Body() body: CreateReservationDto): Promise<ReplyMessageDto> {
    const requiredBody = {
      userId: new Types.ObjectId(body.userId),
      roomId: new Types.ObjectId(body.roomId),
      hotelId: new Types.ObjectId(body.hotelId),
      dateStart: body.dateStart,
      dateEnd: body.dateEnd
    }
    if (await this.clientService.createBooking(requiredBody)) {
      return { message: 'Номер успешно забронирован', statusCode: 200 };
    }
    return { message: 'Не удалось забронировать номер', statusCode: 400 };
  }

  @Post('/register')
  public async registerUser(@Body() body: CreateUserDto): Promise<ReplyMessageDto> {
    const allUsers = await this.clientService.getAllUsers();
    const isExisted = allUsers.find(e => e.email === body.email);

    if (isExisted) {
      throw new HttpException('Такой пользователь уже существует', 400);
    }

    if (this.clientService.registerUser(body)) {
      return { message: 'Вы успешно зарегистрировались.', statusCode: 200 };
    }
    return { message: 'Не удалось Зарегистрировать.', statusCode: 400 };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/reservations/:id')
  @Roles('client')
  public async deleteBooking(@Param() { id }: IparamId): Promise<ReplyMessageDto> {
    const bookingId = new Types.ObjectId(id);

    if (await this.clientService.deleteBooking(bookingId)) {
      return { message: 'Бронирование отменено', statusCode: 200 };
    }
    return { message: 'Не удалось отменить бронирование', statusCode: 400 };
  }

  @Get('/support-requests/:id')
  public async getSupportMessagesList(@Param() { id }: IparamId): Promise<GetSupportRequestDto> {
    const userId = new Types.ObjectId(id);
    return await this.clientService.getSupportMessagesList(userId);
  }
}
