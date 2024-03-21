import axios from "axios";
import IPagination from "../components/models/pagination";
import { IVehicle } from "../components/models/vehicle";

const API = 'http://localhost:3000';

export const getVehicles = async (pagination: IPagination) => {
    return await axios.post<IPagination>(`${API}/vehicle`, pagination);
}

export const createVehicle = async (vehicle: IVehicle) => {
    return await axios.post(`${API}/vehicle`, vehicle);
}

export const getVehicle = async (id: string) => {
    return await axios.get<IVehicle>(`${API}/vehicle/${id}`);
}

export const updateVehicle = async (id: string, vehicle: IVehicle) => {
    return await axios.put<IVehicle>(`${API}/vehicle/${id}`, vehicle);
}

export const deleteVehicle = async (id: string, alive: boolean) => {
    return await axios.put<IVehicle>(`${API}/vehicle/disabled/${id}`, {alive});
}

export const getTrackigByVehicle = async (vehicleId: string) => {
    return await axios.get<IVehicle>(`${API}/vehicle/tracking/${vehicleId}`);
}