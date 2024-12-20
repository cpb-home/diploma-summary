import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";
import { JwtPayload } from "src/interfaces/payload.interface";
import { GetUserDto } from "src/interfaces/dto/get-user";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET + '',
    })
  }

  async validate(payload: JwtPayload): Promise<GetUserDto> {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new HttpException('Неверный токен', HttpStatus.UNAUTHORIZED);
    }
    // const returnUser = new UserDto;
    // returnUser.email = user.email;
    // returnUser.id = user._id;
    // returnUser.role = user.role;
    return user;
  }
}