import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { Roles, RolesGuard } from 'src/validation/rolesGuard';
import { UserDto } from 'src/interfaces/dto/user.dto';
import { toUserDto } from 'src/functions/toDtoFormat';
import { IparamId, IparamUserId } from 'src/interfaces/param-id';
import { Types } from 'mongoose';
import { IReservationItemForFront } from 'src/interfaces/param-reservations';
import { ReplyMessageDto } from 'src/interfaces/dto/replyMessage.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/api/manager')
export class ManagerController {
  constructor (private readonly managerService: ManagerService) {}

  @Get('/users')
  @Roles('manager')
  public async getAllUsers(): Promise<UserDto[]> {
    const users = await this.managerService.getAllUsers();
    const usersForFront: UserDto[] = [];
    if (users.length > 0) {
      for (const user of users) {
        usersForFront.push(toUserDto(user));
      }
    }

    return usersForFront;
  }

  @Get('/reservations/:userId')
  @Roles('manager')
  public async getUserBookings(@Param() { userId }: IparamUserId): Promise<IReservationItemForFront[]> {
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
/*
  @Get('/support-requests')
  @Roles('manager')
  public async getAllSupportRequests() {
    return await this.managerService.getAllSupportRequests();
  }
*/
}
