import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { IparamId } from 'src/interfaces/param-id';
import { CreateReservationDto } from 'src/interfaces/dto/create-reservation';
import { OptionsBookingDto } from 'src/interfaces/dto/options-booking';
import { Types } from 'mongoose';
import { IReservationItemForFront } from 'src/interfaces/param-reservations';
import { ReplyMessageDto } from 'src/interfaces/dto/replyMessage.dto';
import { Roles, RolesGuard } from 'src/validation/rolesGuard';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

@Controller('/api/client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/reservations/:id')
  @Roles('client')
  public async getUserBookings(@Param() { id }: IparamId): Promise<IReservationItemForFront[]> {
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
      return { message: 'Номер успешно забронирован' };
    }
    return { message: 'Не удалось забронировать номер' };
  }

  @Post('/register')
  public registerUser() {

  }

  @Delete('/reservations/:id')
  public deleteBooking(@Param() { id }: IparamId) {
    
  }

  @Post('/support-requests')
  public createSupportMessage() {
    
  }

  @Get('/support-requests')
  public getSupportMessagesList() {
    
  }
}
