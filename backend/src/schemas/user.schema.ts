import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ROLES } from "src/constants/enums";

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({required: true, unique: true})
  public email: string;

  @Prop({required: true})
  public passwordHash: string;

  @Prop({required: true})
  public name: string;

  @Prop()
  public contactPhone: string;

  @Prop({type: String, enum: ROLES, required: true, default: ROLES.CLIENT})
  public role: ROLES;
}

export const UserSchema = SchemaFactory.createForClass(User);