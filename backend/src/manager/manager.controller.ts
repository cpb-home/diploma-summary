import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { Roles, RolesGuard } from 'src/validation/rolesGuard';
import { ResponseUserDto } from 'src/interfaces/dto/response-user';
import { toUserDto } from 'src/functions/toResponseUserDto';
import { IparamId, IparamUserId } from 'src/interfaces/param-id';
import { Types } from 'mongoose';
import { ReplyMessageDto } from 'src/interfaces/dto/replyMessage.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { ResponseReservationDto } from 'src/interfaces/dto/response-reservation';
import { GetSupportRequestDto } from 'src/interfaces/dto/get-supportRequest';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/api/manager')
export class ManagerController {
  constructor (private readonly managerService: ManagerService) {}

  @Get('/users')
  @Roles('manager')
  public async getAllUsers(): Promise<ResponseUserDto[]> {
    const users = await this.managerService.getAllUsers();
    const usersForFront: ResponseUserDto[] = [];
    if (users.length > 0) {
      for (const user of users) {
        usersForFront.push(toUserDto(user));
      }
    }

    return usersForFront;
  }

  @Get('/reservations/:userId')
  @Roles('manager')
  public async getUserBookings(@Param() { userId }: IparamUserId): Promise<ResponseReservationDto[]> {
    const id = new Types.ObjectId(userId);
    
    return await this.managerService.getUserBookings(id);
  }

  @Delete('/reservations/:id')
  @Roles('manager')
  public async deleteUserBooking(@Param() { id }: IparamId): Promise<ReplyMessageDto> {
    const bookingId = new Types.ObjectId(id);

    if (await this.managerService.deleteUserBooking(bookingId)) {
      return { message: 'Бронирование отменено', statusCode: 200 };
    }
    return { message: 'Не удалось отменить бронирование', statusCode: 400 };
  }

  @Get('/support-requests')
  //@Roles('manager')
  public async getAllSupportRequests(): Promise<GetSupportRequestDto[]> {
    return await this.managerService.getAllSupportRequests();
  }
}
