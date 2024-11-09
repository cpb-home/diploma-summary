import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";

export type MessageDocument = Document & Message;

@Schema()
export class Message {
  @Prop({required: true})
  public author: ObjectId;

  @Prop({required: true})
  public sentAt: Date;

  @Prop({required: true})
  public text: string;

  @Prop()
  public readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);