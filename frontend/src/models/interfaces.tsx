export interface IHotelsListReducer {
  loading: boolean;
  error: string;
  hotels: IHotelsListItem[];
}

export interface IHotelsListItem {
  Title?: string;
  Year?: string;
  imdbID: string;
  Type?: string;
  Poster?: string;
}