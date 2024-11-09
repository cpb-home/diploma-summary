import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { ObjectId, Document } from "mongoose";

export type ReservationDocument = Document & Reservation;

@Schema()
export class Reservation {
  @Prop({required: true})
  public userId: ObjectId;

  @Prop({required: true})
  public hotelId: ObjectId;

  @Prop({required: true})
  public roomId: ObjectId;

  @Prop({required: true})
  public dateStart: Date;

  @Prop({required: true})
  public dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);