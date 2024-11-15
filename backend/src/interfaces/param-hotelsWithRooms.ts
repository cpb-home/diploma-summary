import { Types } from "mongoose";

export interface IHotelWithRooms {
  title: string,
  description: string,
  createdAt: Date,
  updatedAt: Date,
  availableRooms: IRoomForHotel[],
}

export interface IRoomForHotel {
  hotel: Types.ObjectId;
  description?: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  isEnabled: boolean;
}