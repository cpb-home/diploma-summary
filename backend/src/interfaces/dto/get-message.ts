import { IsDate, IsNotEmpty, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class GetMessageDto {
  @IsNotEmpty()
  _id: string | unknown;

  @IsNotEmpty()
  author: Types.ObjectId;

  @IsNotEmpty()
  @IsDate()
  sentAt: Date;

  @IsNotEmpty()
  text: string;

  @IsDate()
  @IsOptional()
  readAt?: Date;
}
