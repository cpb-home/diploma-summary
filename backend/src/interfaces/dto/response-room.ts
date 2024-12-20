import { IsNotEmpty, IsOptional } from "class-validator";

export class ResponseRoomDto {
  @IsNotEmpty()
  description: string;

  @IsOptional()
  images: string[];
}