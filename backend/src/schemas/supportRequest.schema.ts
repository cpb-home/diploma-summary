import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";
import { Message } from "./message.schema";

export type SupportRequestSchema = Document & SupportRequest;

export class SupportRequest {
  @Prop({required: true})
  public user: ObjectId;

  @Prop({required: true})
  public createdAt: Date;

  @Prop()
  public messages: Message[];

  @Prop()
  public isActive: boolean;
}

export const SupportRequestSchema = SchemaFactory.createForClass(SupportRequest);