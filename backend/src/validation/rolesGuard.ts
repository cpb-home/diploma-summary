import { CanActivate, ExecutionContext, HttpException, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler()); console.log(roles);
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRole = request.headers['x-roles'];

    if (!userRole) {
      throw new HttpException(`Не указана роль пользователя`, 403);
    }

    if (!roles.some(role => role === userRole)) {
      throw new HttpException(`Доступ пользователю с ролью ${userRole} запрещён`, 403);
    }

    return true;
  }
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);