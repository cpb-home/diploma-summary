import { IsNotEmpty, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class FromBaseMessage {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  sentAt: Date;

  @IsNotEmpty()
  text: string;

  @IsOptional()
  readAt?: Date;
}