import { IsDate, IsNotEmpty, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class GetReservationDto {
  @IsNotEmpty()
  _id: string | unknown;

  @IsNotEmpty()
  userId: Types.ObjectId;

  @IsNotEmpty()
  hotelId: Types.ObjectId;

  @IsNotEmpty()
  roomId: Types.ObjectId;

  @IsNotEmpty()
  @IsDate()
  dateStart: Date;

  @IsNotEmpty()
  @IsDate()
  dateEnd: Date;
}