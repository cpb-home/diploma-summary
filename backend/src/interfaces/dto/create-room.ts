import { IsNotEmpty, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class CreateRoomDto {
  @IsNotEmpty()
  hotel: Types.ObjectId;

  @IsOptional()
  description?: string;

  @IsOptional()
  images?: string[];
}