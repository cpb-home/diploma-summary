import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from './auth.service';
import { JwtPayload } from 'src/interfaces/payload.interface';
console.log('LocalStrateg')

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: JwtPayload): Promise<any> {console.log('validate is working')
    const user = await this.authService.validateUser(email);
    if (!user) {
      console.log('user NOT found')
      throw new UnauthorizedException();
    }
    console.log('user found')
    return user;
  }
}