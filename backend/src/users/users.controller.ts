import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
//import { UserDocument } from 'src/schemas/user.schema';
//import { CreateUserDto } from 'src/interfaces/dto/create-user';

@Controller('/api')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
/*
  @Post('admin/users')
  public create(@Body() body: CreateUserDto): Promise<UserDocument> {
    return this.userService.create(body);
  }*/
}
