import { IsEmail, IsNotEmpty, IsOptional, Length } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(3, 20)
  passwordHash: string;

  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @IsOptional()
  @Length(5, 30)
  contactPhone?: string;

  @IsNotEmpty()
  role: string;
}
