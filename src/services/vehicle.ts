import axios, { AxiosResponse } from "axios";
import IPagination from "../components/models/pagination";
import { IVehicle } from "../components/models/vehicle";

const API: string = process.env.REACT_APP_API!;

export const GetVehicles = async (
  pagination: IPagination
): Promise<AxiosResponse | any> => {
  const URL: string = `${API}/vehicle`;
  const method = "post";
  try {
    const response: AxiosResponse = await axios[method](URL, {
      data: pagination,
    });
    return response.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};

export const SaveVehicle = async (
  vehicle: IVehicle | any
): Promise<AxiosResponse | any> => {
  const URL: string =
    vehicle._id !== undefined && vehicle._id > 0
      ? `${API}/vehicle/${vehicle._id}`
      : `${API}/vehicle/new`;
  const method: "post" | "put" =
    vehicle._id !== undefined && vehicle._id > 0 ? "put" : "post";
  try {
    const response: AxiosResponse = await axios[method](URL, vehicle);
    return response.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};

export const GetVehicleById = async (
  id: string
): Promise<AxiosResponse | any> => {
  const URL: string = `${API}/vehicle/${id}`;
  const method = "get";
  try {
    const response: AxiosResponse = await axios[method](URL);
    return response.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};

export const DisabledVehicle = async (
  id: string,
  alive: boolean
): Promise<AxiosResponse | any> => {
  const URL: string = `${API}/vehicle/disabled/${id}`;
  const method = "put";
  try {
    const response: AxiosResponse = await axios[method](URL, { alive });
    return response.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};

export const GetTrackigByVehicle = async (
  vehicleId: string
): Promise<AxiosResponse | any> => {
  const URL: string = `${API}/vehicle/tracking/${vehicleId}`;
  const method = "get";
  try {
    const response: AxiosResponse = await axios[method](URL);
    return response.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};
