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
  availableRooms: IHotelsListItemRoom[];
}

export interface IHotelsListItemRoom {
  _id: string;
  hotel: string;
  description?: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  isEnabled: boolean;
}

export interface IRoomsListReducer {
  loading: boolean;
  error: string;
  rooms: IRoomListItem[];
}

export interface IRoomListItem {
  _id: string;
  hotel: IHotelShortInfo;
  description?: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  isEnabled: boolean;
}

export interface IHotelShortInfo {
  _id: string;
  title: string,
  description?: string;
}