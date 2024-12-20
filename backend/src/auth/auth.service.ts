import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/interfaces/dto/login-user';
import { ResponseUserDto } from 'src/interfaces/dto/response-user';
import { GetUserDto } from 'src/interfaces/dto/get-user';
import { JwtPayload } from 'src/interfaces/payload.interface';
import { UsersService } from 'src/users/users.service';
import { config } from 'dotenv';
import { ResponseLoginStatusDto } from 'src/interfaces/dto/response-loginStatus';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(payload: JwtPayload): Promise<GetUserDto> {
    //const hash = createHash("md5").update(payload.password).digest("hex");
    const user = await this.userService.findOne(payload.email);
    if (!user) {
      throw new HttpException('Пользователь с таким e-mail не найден', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async login(LoginUserDto: LoginUserDto): Promise<ResponseLoginStatusDto> {
    const user = await this.userService.findByLogin(LoginUserDto); // id, email, role
    const token = this._createToken(user);
    return {
      email: user.email,
      role: user.role,
      id: user.id,
      ...token,
    }
  }

  async getRole(email: string): Promise<GetUserDto> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new HttpException('Пользователь с таким e-mail не найден', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private _createToken({ email }: ResponseUserDto): any {
    const expiresIn = config().parsed.EXPIRESIN;
    const user: JwtPayload = { email };
    const accessToken = this.jwtService.sign(user);

    return {expiresIn, accessToken};
  }
}
