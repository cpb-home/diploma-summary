import { IsDate, IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class CreateReservationDto {
  @IsNotEmpty()
  userId: Types.ObjectId;

  @IsNotEmpty()
  hotelId: Types.ObjectId;

  @IsNotEmpty()
  roomId: Types.ObjectId;

  @IsNotEmpty()
  dateStart: string;

  @IsNotEmpty()
  dateEnd: string;
}