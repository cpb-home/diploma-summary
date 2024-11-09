import { IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateReservationDto {
  @IsNotEmpty()
  userId: ObjectId;

  @IsNotEmpty()
  hotelId: ObjectId;

  @IsNotEmpty()
  roomId: ObjectId;

  @IsNotEmpty()
  dateStart: Date;

  @IsNotEmpty()
  dateEnd: Date;
}