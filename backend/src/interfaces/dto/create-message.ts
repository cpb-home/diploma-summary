import { IsDate, IsNotEmpty, IsOptional } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateMessageDto {
  @IsNotEmpty()
  author: ObjectId;

  @IsNotEmpty()
  @IsDate()
  sentAt: Date;

  @IsNotEmpty()
  text: string;

  @IsOptional()
  readAt?: Date;
}