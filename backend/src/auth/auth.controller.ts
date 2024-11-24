import { Body, Controller, Post, Request, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/interfaces/dto/login-user';
import { LoginStatus } from 'src/interfaces/login-status.interface';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  public async login(@Body() body: LoginUserDto): Promise<LoginStatus> {
    return await this.authService.login(body);
  }
}
