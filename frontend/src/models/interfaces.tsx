export interface IHotelsListReducer {
  loading: boolean;
  error: string;
  hotels: IHotelsListItem[];
}

export interface IHotelsListItem {
  id: string;
  title: string;
  description?: string;
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
  id: string;
  description?: string;
  images: string[];
  hotel: IHotelsListItem;
}

export interface IHotelShortInfo {
  _id: string;
  title: string;
  description?: string;
}

export interface ICurrentUser {
  email: string | null;
  id: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

export interface IUserInfo {
  id?: string;
  email: string;
  name: string;
  role: string;
  contactPhone?: string;
}

export interface ISupportUser {
  id: string;
  name: string;
  unreadCount: number;
}

export interface IChangePage {
  itemType: string;
  id: string;
}

export interface IAddPage {
  itemType: string;
  hotelId?: string;
}

export interface IBookingsItem {
  id: string;
  startDate: string;
  endDate: string;
  hotelRoom: {
    description: string;
    images: string[];
  };
  hotel: {
    title: string;
    description?: string;
  }
}