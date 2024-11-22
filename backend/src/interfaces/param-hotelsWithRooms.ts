import { Types } from "mongoose";

export interface IHotelsListItem {
  _id: Types.ObjectId,
  title: string,
  description: string,
  createdAt: Date,
  updatedAt: Date,
  availableRooms: IHotelsListItemRoom[],
}

export interface IHotelsListItemForFront {
  id: string,
  title: string,
  description: string,
}

export interface IHotelsListItemRoom {
  _id: Types.ObjectId,
  hotel: Types.ObjectId;
  description: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  isEnabled: boolean;
}

export interface IRoomsListReducer {
  loading: boolean;
  error: string;
  rooms: IRoomListItemForFront[];
}

export interface IRoomListItemForFront {
  id: string;
  description: string;
  images: string[];
  hotel: IHotelsListItemForFront;
}