import { IsDate, IsNotEmpty, IsOptional } from "class-validator";

export class FromBaseHotel {
  @IsNotEmpty()
  _id: string;

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
