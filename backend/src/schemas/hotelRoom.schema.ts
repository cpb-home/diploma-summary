import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";

export type HotelRoomDocument = HotelRoom & Document;

@Schema()
export class HotelRoom {
  @Prop({required: true})
  public hotel: ObjectId;

  @Prop()
  public description: string;

  @Prop()
  public images: string[];

  @Prop({required: true})
  public createdAt: Date;

  @Prop({required: true})
  public updatedAt: Date;

  @Prop({required: true})
  public isEnabled: boolean;
}

export const HotelSchema = SchemaFactory.createForClass(HotelRoom);