import axios, { AxiosResponse } from "axios";
import { ITracking } from "../components/models/tracking";

export const createTracking = async (tracking: ITracking) => {
  return await axios.post(`${process.env.API}/tracking`, tracking);
};

export const List = async (data: any): Promise<AxiosResponse | any> => {
  try {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!axios?.defaults?.headers?.common.Authorization) {
      throw new Error("Bearer token no configurado");
    }
    const response: AxiosResponse = await axios.post(
      `${process.env.API}/tracking`,
      data
    );
    return response.data;
  } catch (err) {
    return ("Error Interno, por favor intente nuevamente");
  }
};

export const getTracking = async (id: string) => {
  return await axios.get<ITracking>(`${process.env.API}/tracking/${id}`);
};

export const deleteVehicle = async (id: string) => {
  return await axios.delete<ITracking>(`${process.env.API}/tracking/${id}`);
};

export const trackingByDate = async (vehicleId: string) => {
  return await axios.post<ITracking>(
    `${process.env.API}/tracking/vehicle/${vehicleId}`
  );
};
