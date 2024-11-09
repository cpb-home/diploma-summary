import { IsDate, IsNotEmpty, IsOptional, Length } from "class-validator";

export class CreateHotelDto {
  @IsNotEmpty()
  @Length(2, 100)
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
