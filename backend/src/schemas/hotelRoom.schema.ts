import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type HotelRoomDocument = HotelRoom & Document;

@Schema()
export class HotelRoom {
  @Prop({required: true})
  public hotel: Types.ObjectId;

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

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);