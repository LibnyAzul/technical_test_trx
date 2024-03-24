import React from "react";
import {
  GridActionsCellItem,
  GridColumns,
  GridRowParams,
} from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import MapIcon from "@mui/icons-material/Map";
import BackupIcon from "@mui/icons-material/Backup";
import { green, red, lightBlue } from "@mui/material/colors";
import { ITracking } from "./tracking";

export interface IVehicle {
  createdAt?: string | Date;
  updatedAt?: string | Date;
  plate: string;
  economicNumber: string;
  vim: string;
  seats: number;
  insurance: string;
  insuranceNumber: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  alive: boolean;
  tracking: ITracking[];
  _id?: string;
  id?: string;
}

export const iVehicle: IVehicle = {
  plate: "",
  economicNumber: "",
  vim: "",
  seats: 0,
  insurance: "",
  insuranceNumber: "",
  brand: "",
  model: "",
  year: 0,
  color: "",
  alive: true,
  tracking: [],
};

// End Initial States
// Stard DataGrid Components
export const GenerateColumns = (navigate: any, ChangeAlive: any): any => {
  const columns: GridColumns = [
    {
      field: "plate",
      headerName: "Placas",
      type: "string",
      flex: 1,
    },
    {
      field: "economicNumber",
      headerName: "No. Economico",
      type: "string",
      flex: 1,
    },
    {
      field: "vim",
      headerName: "VIM",
      type: "string",
      flex: 1,
    },
    {
      field: "seats",
      headerName: "No. de Asientos",
      type: "number",
      flex: 1,
    },
    {
      field: "insurance",
      headerName: "Aseguradora",
      type: "string",
      flex: 1,
    },
    {
      field: "insuranceNumber",
      headerName: "No. de Seguro",
      type: "string",
      flex: 1,
    },
    {
      field: "brand",
      headerName: "Marca",
      type: "string",
      flex: 1,
    },
    {
      field: "model",
      headerName: "Modelo",
      type: "string",
      flex: 1,
    },
    {
      field: "year",
      headerName: "Año",
      type: "number",
      flex: 1,
    },
    {
      field: "color",
      headerName: "Color",
      type: "string",
      flex: 1,
    },
    {
      field: "alive",
      headerName: "Estatus",
      type: "actions",
      flex: 1,
      renderCell: (params: any) => {
        const isAlive: boolean = params.row.alive;
        return [
          <GridActionsCellItem
            key={params._id}
            icon={
              isAlive ? (
                <CheckCircleIcon sx={{ color: green.A700 }} />
              ) : (
                <HighlightOffIcon sx={{ color: red.A700 }} />
              )
            }
            label={isAlive ? "Activo" : "Inactivo"}
            onClick={() => ChangeAlive(params.row._id, isAlive)}
            placeholder="Cambiar estatus"
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            showInMenu={false}
          />,
        ];
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      cellClassName: "actions",
      flex: 1,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key={`${params.id}-1`}
          icon={<VisibilityIcon sx={{ color: lightBlue.A700 }} />}
          label="Ver"
          onClick={() => navigate(`/vehicle/details/${params.id}`)}
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`${params.id}-2`}
          icon={<ModeEditOutlinedIcon sx={{ color: lightBlue.A700 }} />}
          label="Editar"
          onClick={() => navigate(`/vehicle/edit/${params.id}`)}
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
          showInMenu={false}
          sx={{ display: !params.row.alive ? "none" : "block" }}
        />,
        <GridActionsCellItem
          key={`${params.id}-2`}
          icon={<MapIcon sx={{ color: lightBlue[400] }} />}
          label="Mapa"
          onClick={() => navigate(`/vehicle/map/${params.id}`)}
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`${params.id}-3`}
          icon={<BackupIcon sx={{ color: lightBlue[400] }} />}
          label="Importación"
          onClick={() => navigate(`/tracking/import/${params.id}`)}
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
          showInMenu={false}
          sx={{ display: !params.row.alive ? "none" : "block" }}
        />,
      ],
    },
  ];
  return columns;
};
// End DataGrid Components
