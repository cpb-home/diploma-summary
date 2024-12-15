import { IsBoolean, IsDate, IsNotEmpty, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class FromBaseRooms {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  hotel: Types.ObjectId;

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