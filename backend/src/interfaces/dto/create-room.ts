import { IsBoolean, IsDate, IsNotEmpty, IsOptional } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateRoomDto {
  @IsNotEmpty()
  hotel: ObjectId;

  @IsOptional()
  description?: string;

  @IsOptional()
  images?: string[];

  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @IsNotEmpty()
  @IsDate()
  updatedAt: Date;

  @IsNotEmpty()
  @IsBoolean()
  isEnabled: Boolean;
}