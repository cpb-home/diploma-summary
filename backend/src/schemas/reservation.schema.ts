import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { ObjectId, Document, Types } from "mongoose";

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
  @Prop({required: true})
  public userId: Types.ObjectId;

  @Prop({required: true})
  public hotelId: Types.ObjectId;

  @Prop({required: true})
  public roomId: Types.ObjectId;

  @Prop({required: true})
  public dateStart: Date;

  @Prop({required: true})
  public dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);