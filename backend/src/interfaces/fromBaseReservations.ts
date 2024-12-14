import { IsDate, IsNotEmpty } from "class-validator";

export class FromBaseBooking {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  hotelId: string;

  @IsNotEmpty()
  roomId: string;

  @IsNotEmpty()
  @IsDate()
  dateStart: Date;

  @IsNotEmpty()
  @IsDate()
  dateEnd: Date;
}
