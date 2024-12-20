import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcrypt';
import { Connection, Model } from 'mongoose';
import { toUserDto } from 'src/functions/toResponseUserDto';
import { LoginUserDto } from 'src/interfaces/dto/login-user';
import { ResponseUserDto } from 'src/interfaces/dto/response-user';
import { GetUserDto } from 'src/interfaces/dto/get-user';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async findByLogin({ email, password }: LoginUserDto): Promise<ResponseUserDto> {
    const user = await this.findOne(email);

    if (!user) {
      throw new HttpException('Пользователь с таким e-mail не найден', 401);
    }

    const areEqual = await compare(password, user.passwordHash);

    if (!areEqual) {
      throw new HttpException('Неверный пароль', HttpStatus.UNAUTHORIZED);
    }
    return toUserDto(user);
  }

  public async findOne(email: string): Promise<GetUserDto | undefined> {
    const user = await this.UserModel.findOne({email});
    if (!user) {
      throw new HttpException('Пользователь с таким e-mail не найден', 401);
    }
    return user;
  }
}
