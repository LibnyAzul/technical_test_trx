export interface ITracking {
  createdAt?: string | Date;
  updatedAt?: string | Date;
  latitude: string;
  longitude: string;
  _id?: string;
}

export const iTracking: ITracking = {
    latitude: "",
    longitude: ""
};