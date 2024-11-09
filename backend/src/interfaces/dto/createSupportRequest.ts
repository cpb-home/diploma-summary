import { IsBoolean, IsDate, IsNotEmpty, IsOptional } from "class-validator";
import { ObjectId } from "mongoose";
import { Message } from "src/schemas/message.schema";

export class SupportRequestDto {
  @IsNotEmpty()
  user: ObjectId;

  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @IsOptional()
  messages: Message[];

  @IsOptional()
  @IsBoolean()
  isActive: Boolean;
}