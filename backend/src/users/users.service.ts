import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcrypt';
import { Connection, Model } from 'mongoose';
import { toUserDto } from 'src/functions/toUserDto';
import { CreateUserDto } from 'src/interfaces/dto/create-user';
import { LoginUserDto } from 'src/interfaces/dto/login-user';
import { UserDto } from 'src/interfaces/dto/user.dto';
import { FromBaseUser } from 'src/interfaces/fromBaseUser';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  public async create(data: CreateUserDto): Promise<UserDocument> {
    const user = new this.UserModel(data);

    return await user.save();
  }

  async findByLogin({ email, password }: LoginUserDto): Promise<UserDto> {
    const user = await this.findOne(email);

    if (!user) {
      throw new HttpException('Такой пользователь не найден', HttpStatus.NOT_FOUND);
    }

    const areEqual = await compare(password, user.passwordHash);

    if (!areEqual) {
      throw new HttpException('Неверный пароль', HttpStatus.UNAUTHORIZED);
    }
    return toUserDto(user);
  }

  public async findOne(email: string): Promise<FromBaseUser | undefined> {
    const found = await this.UserModel.findOne({email});
    return found;
  }
}
