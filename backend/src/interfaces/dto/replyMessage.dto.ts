import { IsOptional } from "class-validator";

export class ReplyMessageDto {

  @IsOptional()
  message?: string;

  @IsOptional()
  statusCode?: number;
}
