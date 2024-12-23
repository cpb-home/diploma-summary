import { IsDate, IsNotEmpty, IsOptional } from "class-validator";

export class GetHotelDto {
  @IsNotEmpty()
  _id: string | unknown;

  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @IsNotEmpty()
  @IsDate()
  updatedAt: Date;
}
