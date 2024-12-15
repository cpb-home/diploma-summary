import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { UpdateHotelDto } from 'src/interfaces/dto/update-hotel';
import { Types } from 'mongoose';
import { UpdateRoomDto } from 'src/interfaces/dto/update-room';
import { FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Roles, RolesGuard } from 'src/validation/rolesGuard';

@Controller('/api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/users')
  @Roles('admin', 'mainAdmin')
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
  @Roles('admin', 'mainAdmin')
  public async getUserInfo(@Param() { email }: IparamEmail): Promise<UserDto> {
    const user = await this.adminService.getUserInfo(email);
    
    return toUserDto(user);
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/users')
  @Roles('admin', 'mainAdmin')
  public async createUser(@Body() body: CreateUserDto): Promise<ReplyMessageDto> {
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/hotels')
  @Roles('admin', 'mainAdmin')
  public async createHotel(@Body() body: CreateHotelDto): Promise<ReplyMessageDto> {
    if (await this.adminService.createHotel(body)) {
      return { message: 'Гостиница успешно добавлена', statusCode: 200 };
    }
    return { message: 'Не удалось добавить гостиницу', statusCode: 400 };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/hotels/:id')
  @Roles('admin', 'mainAdmin')
  public async updateHotel(
    @Param() { id }: IparamId,
    @Body() body: UpdateHotelDto,
  ): Promise<ReplyMessageDto> {
    if (await this.adminService.updateHotel(new Types.ObjectId(id), body)) {
      return { message: 'Гостиница успешно обновлена' };
    }
    return { message: 'Не удалось обновить гостиницу' };
  }

  @Delete('/hotels/:id')
  public deleteHotel(@Param() { id }: IparamId): Promise<UserDocument> {
    return this.adminService.deleteUser(id);
  }

  @Get('/hotel-rooms/:hotelId')
  public getAllRoomsOfHotel(): Promise<FromBaseHotel[]> {
    return;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/hotel-rooms/:id')
  @Roles('admin', 'mainAdmin')
  @UseInterceptors(FilesInterceptor('file'))
  public async createRoom(
    @Body() body,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param() { id }: IparamId,): Promise<ReplyMessageDto> {
    const images: string[] = [];

    for (const file of files) {
      const fileName = `${uuidv4()}${extname(file.originalname)}`;
      await this.adminService.saveFile(file.path, fileName);
      images.push(fileName);
    }

    const create = await this.adminService.createRoom({hotel: new Types.ObjectId(id), description: body.description, images: images});

    if (create) {
      return { message: 'Номер успешно добавлен' };
    }
    return { message: 'Не удалось добавить номер' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/hotel-rooms/:id')
  @Roles('admin', 'mainAdmin')
  public async updateRoom(
    @Param() { id }: IparamId,
    @Body() body: UpdateRoomDto,
  ): Promise<ReplyMessageDto> {
    if (await this.adminService.updateRoom(new Types.ObjectId(id), body)) {
      return { message: 'Комната успешно обновлена' };
    }
    return { message: 'Не удалось обновить комнату' };
  }
}

