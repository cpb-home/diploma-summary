import { IsNotEmpty, IsOptional } from "class-validator";

export class ResponseHotelDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  title: string;

  @IsOptional()
  description: string;
}