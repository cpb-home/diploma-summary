import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateUserDto } from 'src/interfaces/dto/create-user';
import { UserDocument } from 'src/schemas/user.schema';
import { IparamEmail, IparamId } from 'src/interfaces/param-id';
import { UpdateUserDto } from 'src/interfaces/dto/update-user';
import { HotelDocument } from 'src/schemas/hotel.schema';
import { CreateHotelDto } from 'src/interfaces/dto/create-hotel';
//import { createHash } from 'crypto';
import { UserDto } from 'src/interfaces/dto/user.dto';
import { toUserDto } from 'src/functions/toDtoFormat';
import { FromBaseHotel } from 'src/interfaces/fromBaseHotel';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { ReplyMessageDto } from 'src/interfaces/dto/replyMessage.dto';

@Controller('/api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/users')
  public async getAllUsers(): Promise<UserDto[]> {
    const users = await this.adminService.getAllUsers();
    const usersForFront: UserDto[] = [];
    if (users.length > 0) {
      for (const user of users) {
        usersForFront.push(toUserDto(user));
      }
    }

    return usersForFront;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/:email')
  public async getUserInfo(@Param() { email }: IparamEmail): Promise<UserDto> {
    const user = await this.adminService.getUserInfo(email);
    
    return toUserDto(user);
  }
  
  @Post('/users')
  public async createUser(@Body() body: CreateUserDto): Promise<ReplyMessageDto> {
    //  НАДО:
    //  СДЕЛАТЬ ПОЛУЧЕНИЕ ДАННЫХ ПО ЭТОМУ РОУТУ
    //  НАСТРОИТЬ ВСЕ АДМИНСКИЕ РОУТЫ, ЧТОБЫ ПОЛУЧАЛИ ТОЛЬКО ОТ АДМИНА, ИНАЧЕ 403
    /*
      1. if (currentUser isNotAuthorized) error 401
      2. id (currentUser !== 'admin' || currentUser !== 'mainAdmin') error 403
    */

    const allUsers = await this.adminService.getAllUsers();
    
    const isExisted = allUsers.find(e => e.email === body.email);
    if (isExisted) {
      throw new HttpException('Такой пользователь уже существует', 400);
    }
    
    if (this.adminService.createUser(body)) {
      return { message: 'Пользователь успешно добавлен' };
    }
    return { message: 'Не удалось добавить пользователя' };
  }

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
  public async getAllHotels(): Promise<HotelDocument[]> {
    return await this.adminService.getAllHotels();
    
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
  public getAllRoomsOfHotel(): Promise<FromBaseHotel[]> {
    return;
  }

  @Post('/hotel-rooms')
  public createRoom(@Body() body: CreateUserDto): Promise<UserDto> {
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
