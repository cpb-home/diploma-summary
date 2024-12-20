import { Body, Controller, Get, Post, Request, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/interfaces/dto/login-user';
import { JwtAuthGuard } from './jwt.auth.guard';
import { JwtPayload } from 'jsonwebtoken';
import { ResponseLoginStatusDto } from 'src/interfaces/dto/response-loginStatus';
import { RequestEmailDto } from 'src/interfaces/dto/request-email';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  public async login(@Body() body: LoginUserDto): Promise<ResponseLoginStatusDto> {
    return await this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  public logout(): string {
    return 'logouted';
  }

  @UseGuards(JwtAuthGuard)
  @Get('/protected')
  protected() {
    return {
      message: 'This route protected',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/getrole')
  public async getRole(@Body() body: RequestEmailDto): Promise<JwtPayload> {
    const user = await this.authService.getRole(body.email);
    return {role: user.role};
  }
}
