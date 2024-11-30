import { IsEmail, IsNotEmpty } from "class-validator";

export class GetRoleDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}