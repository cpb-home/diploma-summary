import { IsNotEmpty, IsOptional } from "class-validator";
import { ResponseHotelDto } from "./response-hotel";

export class ResponseRoomWithHotelDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  images: string[];

  @IsNotEmpty()
  hotel: ResponseHotelDto;
}