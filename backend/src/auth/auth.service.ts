import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/interfaces/dto/login-user';
import { UserDto } from 'src/interfaces/dto/user.dto';
import { FromBaseUser } from 'src/interfaces/fromBaseUser';
import { LoginStatus } from 'src/interfaces/login-status.interface';
import { JwtPayload } from 'src/interfaces/payload.interface';
import { UsersService } from 'src/users/users.service';
import { config } from 'dotenv';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(payload: JwtPayload): Promise<FromBaseUser> {
    //const hash = createHash("md5").update(payload.password).digest("hex");
    const user = await this.userService.findOne(payload.email);
    if (!user) {
      throw new HttpException('Пользователь с таким e-mail не найден', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async login(LoginUserDto: LoginUserDto): Promise<LoginStatus> {
    const user = await this.userService.findByLogin(LoginUserDto); // id, email, role
    const token = this._createToken(user);
    return {
      email: user.email,
      role: user.role,
      id: user.id,
      ...token,
    }
  }

  async getRole(email: string): Promise<FromBaseUser> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new HttpException('Пользователь с таким e-mail не найден', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private _createToken({ email }: UserDto): any {
    const expiresIn = config().parsed.EXPIRESIN;
    const user: JwtPayload = { email };
    const accessToken = this.jwtService.sign(user);

    return {expiresIn, accessToken};
  }
}
