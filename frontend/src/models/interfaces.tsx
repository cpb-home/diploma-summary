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
}