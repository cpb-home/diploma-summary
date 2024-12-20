import { IsNotEmpty, IsOptional } from "class-validator";

export class ResponeSupportMessage {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  createdAt: string;

  @IsNotEmpty()
  text: string;

  @IsOptional()
  readAt: string;

  @IsNotEmpty()
  author: {
    id: string;
    name: string;
  }
}