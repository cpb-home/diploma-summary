import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class UserDto {
  @IsNotEmpty()
  id: string | unknown;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  contactPhone?: string;
}