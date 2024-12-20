import { IsBoolean, IsDate, IsNotEmpty, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class GetSupportRequestDto {
  @IsNotEmpty()
  _id: string | unknown;

  @IsNotEmpty()
  user: Types.ObjectId;

  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @IsOptional()
  messages: Types.ObjectId[];

  @IsBoolean()
  isActive: boolean;
}
