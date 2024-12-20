import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class ResponseLoginStatusDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  accessToken: any;

  @IsNotEmpty()
  expiresIn: any;
}