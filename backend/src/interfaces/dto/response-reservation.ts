import { IsNotEmpty, IsOptional } from "class-validator";
import { ResponseHotelDto } from "./response-hotel";
import { ResponseRoomDto } from "./response-room";

export class ResponseReservationDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  startDate: string;

  @IsNotEmpty()
  endDate: string;

  @IsOptional()
  hotelRoom: ResponseRoomDto;

  @IsOptional()
  hotel: ResponseHotelDto;
}