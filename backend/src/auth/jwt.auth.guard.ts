import { ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  public handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
    if (err) {
      throw new HttpException('Ошибка JWT: ' + err, 401);
    }
    if (!user) {
      throw new HttpException('Ошибка авторизации JWT', 401);
    }
    return user;
  }
}