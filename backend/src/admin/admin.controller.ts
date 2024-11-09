import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateUserDto } from 'src/interfaces/dto/create-user';
import { UserDocument } from 'src/schemas/user.schema';
import { IparamId } from 'src/interfaces/param-id';
import { UpdateUserDto } from 'src/interfaces/dto/update-user';
import { HotelDocument } from 'src/schemas/hotel.schema';
import { CreateHotelDto } from 'src/interfaces/dto/create-hotel';

@Controller('/api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/users')
  public getAllUsers(): Promise<UserDocument[]> {
    return this.adminService.getAllUsers();
  }
  /*
    1. 401 - если пользователь не авторизован
    2. 403 - если пользователь не админ
  */
  
  @Post('/users')
  public createUser(@Body() body: CreateUserDto): Promise<UserDocument> {
    return this.adminService.createUser(body);
  }
  /*
    1. 401 - если пользователь не авторизован
    2. 403 - если пользователь не админ
  */

  @Put('/users/:id')
  public updateUser(
    @Param() { id }: IparamId,
    @Body() body: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.adminService.updateUser(id, body);
  }

  @Delete('/users/:id')
  public deleteUser(@Param() { id }: IparamId): Promise<UserDocument> {
    return this.adminService.deleteUser(id);
  }



  @Get('/hotels')
  public getAllHotels(): Promise<HotelDocument[]> {
    return this.adminService.getAllHotels();
  }

  @Post('/hotels')
  public createHotel(@Body() body: CreateHotelDto): Promise<HotelDocument> {
    return this.adminService.createHotel(body);
  }
  /*
    1. 401 - если пользователь не авторизован
    2. 403 - если пользователь не админ
  */

  @Put('/hotels/:id')
  public updateHotel(
    @Param() { id }: IparamId,
    @Body() body: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.adminService.updateUser(id, body);
  }
  /*
    1. 401 - если пользователь не авторизован
    2. 403 - если пользователь не админ
  */

  @Delete('/hotels/:id')
  public deleteHotel(@Param() { id }: IparamId): Promise<UserDocument> {
    return this.adminService.deleteUser(id);
  }



  @Get('/hotel-rooms/:hotelId')
  public getAllRoomsOfHotel(): Promise<UserDocument[]> {
    return this.adminService.getAllUsers();
  }

  @Post('/hotel-rooms')
  public createRoom(@Body() body: CreateUserDto): Promise<UserDocument> {
    return this.adminService.createUser(body);
  }
  /*
    1. 401 - если пользователь не авторизован
    2. 403 - если пользователь не админ
  */

  @Put('/hotel-rooms/:id')
  public updateRoom(
    @Param() { id }: IparamId,
    @Body() body: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.adminService.updateUser(id, body);
  }
  /*
    1. 401 - если пользователь не авторизован
    2. 403 - если пользователь не админ
  */

  @Delete('/hotel-rooms/:id')
  public deleteRoom(@Param() { id }: IparamId): Promise<UserDocument> {
    return this.adminService.deleteUser(id);
  }
}
