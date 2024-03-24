import React from "react";
import {
  GridActionsCellItem,
  GridColumns,
  GridRowParams,
} from "@mui/x-data-grid";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { red } from "@mui/material/colors";

export interface ITracking {
  createdAt?: string | Date;
  updatedAt?: string | Date;
  latitude: string;
  longitude: string;
  _id?: string;
  id?: number;
}

export const iTracking: ITracking = {
  latitude: "",
  longitude: "",
};

export const GenerateColumns = (removeCoors: any): any => {
  const columns: GridColumns = [
    {
      field: "id",
      headerName: "Id",
      type: "number",
      flex: 1,
    },
    {
      field: "latitude",
      headerName: "Latitud",
      type: "string",
      flex: 1,
    },
    {
      field: "longitude",
      headerName: "Longitud",
      type: "string",
      flex: 1,
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
          icon={<DeleteForeverIcon sx={{ color: red.A700 }} />}
          label="Ver"
          onClick={() => removeCoors(params.id)}
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
          showInMenu={false}
        />,
      ],
    },
  ];
  return columns;
};
