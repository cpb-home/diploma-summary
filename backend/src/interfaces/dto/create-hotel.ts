import { IsDate, IsNotEmpty, IsOptional } from "class-validator";

export class CreateHotelDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;
/*
  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @IsNotEmpty()
  @IsDate()
  updatedAt: Date;*/
}
