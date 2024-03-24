import axios, { AxiosResponse } from "axios";
import { ITracking } from "../components/models/tracking";
import IPagination from "../components/models/pagination";

const API: string = process.env.REACT_APP_API!;

export const Save = async (
  tracking: ITracking | any
): Promise<AxiosResponse | any> => {
  const URL: string = `${API}/tracking`;
  const method = "post";
  try {
    const response: AxiosResponse = await axios[method](URL, tracking);
    return response.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};

export const GetById = async (id: string): Promise<AxiosResponse | any> => {
  const URL: string = `${API}/tracking/${id}`;
  const method = "get";
  try {
    const response: AxiosResponse = await axios[method](URL);
    return response.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};

export const Delete = async (
  id: string
): Promise<AxiosResponse | any> => {
  const URL: string = `${API}/tracking/${id}`;
  const method = "delete";
  try {
    const response: AxiosResponse = await axios[method](URL);
    return response.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};

export const findByIdAndFilters = async (
  vehicleId: string,
  pagination: IPagination
): Promise<AxiosResponse | any> => {
  const URL: string = `${API}/tracking/vehicle/${vehicleId}`;
  const method = "post";
  try {
    const response: AxiosResponse = await axios[method](URL, pagination);
    return response.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};

export const saveAll = async (
  vehicleId: string,
  list: ITracking[]
): Promise<AxiosResponse | any> => {
  const URL: string = `${API}/tracking/saveAll/${vehicleId}`;
  const method = "post";
  try {
    const response: AxiosResponse = await axios[method](URL, list);
    return response.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};
