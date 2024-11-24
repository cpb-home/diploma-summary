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

  async validateUser(payload: JwtPayload): Promise<FromBaseUser> {console.log('AuthService')
    //const hash = createHash("md5").update(payload.password).digest("hex");
    const user = await this.userService.findOne(payload.email);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async login(LoginUserDto: LoginUserDto): Promise<LoginStatus> {
    const user = await this.userService.findByLogin(LoginUserDto);
    const token = this._createToken(user);
    return {
      email: user.email,
      ...token,
    }
  }

  private _createToken({ email }: UserDto): any {
    const expiresIn = config().parsed.EXPIRESIN;
    const user: JwtPayload = { email };
    const accessToken = this.jwtService.sign(user);

    return {expiresIn, accessToken};
  }
}
