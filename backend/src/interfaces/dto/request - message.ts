import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { IparamId } from "../param-id";

export class RequestMessageDto {
  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  replyUserId: string | null;
}

/*
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { IparamId } from "../param-id";

export class RequestMessageDto {
  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  userId: IparamId;

  @IsOptional()
  managerId?: string;
}

*/