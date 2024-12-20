import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Message } from "./message.schema";

export type SupportRequestDocument = Document & SupportRequest;

@Schema()
export class SupportRequest {
  @Prop({required: true})
  public user: Types.ObjectId;

  @Prop({required: true})
  public createdAt: Date;

  @Prop()
  public messages: Types.ObjectId[];

  @Prop()
  public isActive: boolean;
}

export const SupportRequestSchema = SchemaFactory.createForClass(SupportRequest);