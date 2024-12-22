import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class ResponseUserWithCountDto {
  @IsNotEmpty()
  id: string | unknown;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  unreadCount: number;
}