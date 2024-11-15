export interface IHotelsListReducer {
  loading: boolean;
  error: string;
  hotels: IHotelsListItem[];
}

export interface IHotelsListItem {
  _id: string;
  title: string;
  description?: string;
  createAt: Date;
  updatedAt: Date;
  availableRooms: IRoom[];
}

export interface IRoom {
  _id: string;
  hotel: string;
  description?: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  isEnabled: boolean;
}