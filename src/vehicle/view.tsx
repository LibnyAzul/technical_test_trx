import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { IVehicle, iVehicle } from "../components/models/vehicle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { green, red } from "@mui/material/colors";
import CustomAlerts, {
  ICustomAlerts,
  initialState as iCustomAlerts,
} from "../components/alert";
import _ from "lodash";
import { GetVehicleById } from "../services/vehicle";

const formatDate = (dateString: string | Date | undefined) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  date.setTime(date.getTime() - 360 * 60 * 1000);

  const formattedDate = date.toISOString().slice(0, 16);
  return formattedDate;
};

const View = () => {
  const [vehicle, setVehicle] = useState<IVehicle>(iVehicle);
  const [alert, setAlert] = useState<ICustomAlerts>(iCustomAlerts);
  const { id } = useParams();

  const loadEntity = async (id: string) => {
    await GetVehicleById(String(id)).then((data: IVehicle | any) => {
      if (!_.isNil(data) && data !== "" && "plate" in data) {
        setVehicle(data);
      } else {
        setAlert({
          ...alert,
          open: true,
          alert: {
            type: "error",
            message: "Error al buscar el vehiculo seleccionado",
          },
        });
      }
    });
  };

  const handleCloseAlert = () => setAlert(iCustomAlerts);

  useEffect(() => {
    if (id) {
      loadEntity(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Box>
      <Card>
        <CardHeader
          id="View-Department"
          title="Detalles del Vehículo"
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography
                gutterBottom
                component="div"
                variant="body1"
                sx={{ pl: 4, pb: 1 }}
              >
                <span style={{ fontWeight: "bold" }}>Identificador: </span>
                {vehicle._id ?? ""}
              </Typography>
              <Typography
                gutterBottom
                component="div"
                variant="body1"
                sx={{ pl: 4, pb: 1 }}
              >
                <span style={{ fontWeight: "bold" }}>Placas: </span>
                {vehicle.plate ?? ""}
              </Typography>
              <Typography
                gutterBottom
                component="div"
                variant="body1"
                sx={{ pl: 4, pb: 1 }}
              >
                <span style={{ fontWeight: "bold" }}>No. Ecónomico: </span>
                {vehicle.economicNumber ?? ""}
              </Typography>
              <Typography
                gutterBottom
                component="div"
                variant="body1"
                sx={{ pl: 4, pb: 1 }}
              >
                <span style={{ fontWeight: "bold" }}>VIM: </span>
                {vehicle.vim ?? ""}
              </Typography>
              <Typography
                gutterBottom
                component="div"
                variant="body1"
                sx={{ pl: 4, pb: 1 }}
              >
                <span style={{ fontWeight: "bold" }}>No. Asientos: </span>
                {vehicle.seats ?? ""}
              </Typography>
              <Typography
                gutterBottom
                component="div"
                variant="body1"
                sx={{ pl: 4, pb: 1 }}
              >
                <span style={{ fontWeight: "bold" }}>Aseguradora: </span>
                {vehicle.insurance ?? ""}
              </Typography>
              <Typography
                gutterBottom
                component="div"
                variant="body1"
                sx={{ pl: 4, pb: 1 }}
              >
                <span style={{ fontWeight: "bold" }}>No. Seguro: </span>
                {vehicle.insuranceNumber ?? ""}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                gutterBottom
                component="div"
                variant="body1"
                sx={{ pl: 4, pb: 1 }}
              >
                <span style={{ fontWeight: "bold" }}>Marca: </span>
                {vehicle.brand ?? ""}
              </Typography>
              <Typography
                gutterBottom
                component="div"
                variant="body1"
                sx={{ pl: 4, pb: 1 }}
              >
                <span style={{ fontWeight: "bold" }}>Modelo: </span>
                {vehicle.model ?? ""}
              </Typography>
              <Typography
                gutterBottom
                component="div"
                variant="body1"
                sx={{ pl: 4, pb: 1 }}
              >
                <span style={{ fontWeight: "bold" }}>Año: </span>
                {vehicle.year ?? ""}
              </Typography>
              <Typography
                gutterBottom
                component="div"
                variant="body1"
                sx={{ pl: 4, pb: 1 }}
              >
                <span style={{ fontWeight: "bold" }}>Color: </span>
                {vehicle.color ?? ""}
              </Typography>
              <Typography
                gutterBottom
                component="div"
                variant="body1"
                sx={{ pl: 4, pb: 1, fontWeight: "bold" }}
              >
                {"Estatus: "}
                {vehicle.alive ?? false ? (
                  <CheckCircleIcon sx={{ color: green.A700 }} />
                ) : (
                  <HighlightOffIcon sx={{ color: red.A700 }} />
                )}
              </Typography>
              <Typography
                gutterBottom
                component="div"
                variant="body1"
                sx={{ pl: 4, pb: 1, fontWeight: "bold" }}
              >
                <TextField
                  id="createdDate"
                  label="Fecha de creación"
                  type="datetime-local"
                  disabled
                  value={formatDate(vehicle.createdAt)}
                  sx={{ width: 255 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Typography>
              <Typography
                gutterBottom
                component="div"
                variant="body1"
                sx={{ pl: 4, pb: 1, fontWeight: "bold" }}
              >
                <TextField
                  id="createdDate"
                  label="Fecha de modificación"
                  type="datetime-local"
                  disabled
                  value={formatDate(vehicle.updatedAt)}
                  sx={{ width: 255 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <CustomAlerts params={alert} closeAlert={handleCloseAlert} />
    </Box>
  );
};

export default View;
