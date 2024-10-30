import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateUserDto } from 'src/interfaces/dto/create-user';
import { UserDocument } from 'src/schemas/user.schema';
import { IparamId } from 'src/interfaces/param-id';
import { UpdateUserDto } from 'src/interfaces/dto/update-user';

@Controller('/api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/users')
  public createUser(@Body() body: CreateUserDto): Promise<UserDocument> {
    return this.adminService.createUser(body);
  }

  @Get('/users')
  public getAllUsers(): Promise<UserDocument[]> {
    return this.adminService.getAllUsers();
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
}
