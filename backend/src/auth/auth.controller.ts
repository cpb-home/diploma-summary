import { Body, Controller, Get, Post, Request, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/interfaces/dto/login-user';
import { LoginStatus } from 'src/interfaces/login-status.interface';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt.auth.guard';
import { GetRoleDto } from 'src/interfaces/dto/get-role.dto';
import { JwtPayload } from 'jsonwebtoken';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  public async login(@Body() body: LoginUserDto): Promise<LoginStatus> {
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
  public async getRole(@Body() body: GetRoleDto): Promise<JwtPayload> {
    const user = await this.authService.getRole(body.email);
    return {role: user.role};
  }
}
