import { IsEmail, IsNotEmpty, IsOptional, Length } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  passwordHash: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  contactPhone?: string;

  @IsNotEmpty()
  role: string;
}
