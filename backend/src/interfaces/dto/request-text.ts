import { IsEmail, IsNotEmpty } from "class-validator";

export class RequestTextDto {
  @IsNotEmpty()
  text: string;
}