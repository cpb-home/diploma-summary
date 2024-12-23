import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class RequestTextDto {
  @IsNotEmpty()
  text: string;

  @IsOptional()
  managerId?: string;
}