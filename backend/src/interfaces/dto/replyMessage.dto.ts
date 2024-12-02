import { IsDate, IsNotEmpty, IsOptional } from "class-validator";

export class ReplyMessageDto {

  @IsOptional()
  message?: string;
}
