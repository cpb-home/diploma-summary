import { IsDate, IsOptional } from "class-validator";

export class OptionsBookingDto {
  @IsOptional()
  userId?: string;

  @IsOptional()
  hotelId?: string;

  @IsOptional()
  roomId?: string;

  @IsOptional()
  @IsDate()
  dateStart?: Date;

  @IsOptional()
  @IsDate()
  dateEnd?: Date;
}
