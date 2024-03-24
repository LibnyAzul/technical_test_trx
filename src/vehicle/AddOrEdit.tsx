import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Fab,
  Grid,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IVehicle, iVehicle } from "../components/models/vehicle";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import CustomAlerts, {
  ICustomAlerts,
  initialState as iCustomAlerts,
} from "../components/alert";
import { GetVehicleById, SaveVehicle } from "../services/vehicle";
import _ from "lodash";

const AddOrEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [vehicle, setVehicle] = useState<IVehicle>(iVehicle);
  const [alert, setAlert] = useState<ICustomAlerts>(iCustomAlerts);

  const isUpdate = "id" in params;

  const loadEntity = async (id: string) => {
    await GetVehicleById(String(params.id)).then((data: IVehicle | any) => {
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

  useEffect(() => {
    if (params && params.id) {
      loadEntity(params.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleSave = async () => {
    let message: string = "Ocurrio un incidente inesperado!";
    let isSaveOrUpdate: boolean = false;

    await SaveVehicle(vehicle).then((data: any) => {
      if (isUpdate) {
        isSaveOrUpdate = !_.isNil(data._id) && data._id !== "";
      } else {
        isSaveOrUpdate = "savedVehicle" in data;
      }
      message =
        "message" in data
          ? data.message
          : isSaveOrUpdate
          ? "Vehicle Update"
          : "Error inesperado!";
    });

    setAlert({
      ...alert,
      open: true,
      alert: {
        type: isSaveOrUpdate ? "success" : "error",
        message,
      },
    });

    setTimeout(() => {
      if (isSaveOrUpdate) {
        setVehicle(iVehicle);
        navigate("/");
      }
    }, 1000);
  };

  const handleCloseAlert = () => setAlert(iCustomAlerts);

  return (
    <Box>
      <Card>
        <CardHeader
          action={
            <Fab
              color="primary"
              size="small"
              aria-label="home"
              onClick={() => navigate("/")}
            >
              <FormatListNumberedIcon />
            </Fab>
          }
          id="title"
          title={(isUpdate ? "Editar" : "Agregar") + " Vehículo"}
        />
        <CardContent
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "100%" } }}
          noValidate
          autoComplete="off"
        >
          <Grid container spacing={5}>
            <Grid item xs={4}>
              <TextField
                className="plate"
                id="plate"
                label="Placas"
                type="text"
                sx={{ pb: 2 }}
                variant="standard"
                value={vehicle?.plate}
                required
                onChange={(e) => {
                  setVehicle((prevVehicle) => ({
                    ...prevVehicle,
                    plate: e.target.value,
                  }));
                }}
              />
              <TextField
                className="economicNumber"
                id="economicNumber"
                label="Número Ecónomico"
                type="text"
                sx={{ pb: 2 }}
                variant="standard"
                value={vehicle?.economicNumber}
                required
                onChange={(e) => {
                  setVehicle((prevVehicle) => ({
                    ...prevVehicle,
                    economicNumber: e.target.value,
                  }));
                }}
              />
              <TextField
                className="vim"
                id="vim"
                label="VIM"
                type="text"
                sx={{ pb: 2 }}
                variant="standard"
                value={vehicle?.vim}
                required
                onChange={(e) => {
                  setVehicle((prevVehicle) => ({
                    ...prevVehicle,
                    vim: e.target.value,
                  }));
                }}
              />
              <TextField
                className="seats"
                id="seats"
                label="Asientos"
                type="number"
                sx={{ pb: 2 }}
                variant="standard"
                value={vehicle?.seats}
                required
                onChange={(e) => {
                  setVehicle((prevVehicle) => ({
                    ...prevVehicle,
                    seats: parseInt(e.target.value), // Convertir a número
                  }));
                }}
              />
              <TextField
                className="insurance"
                id="insurance"
                label="Adeguradora"
                type="text"
                sx={{ pb: 2 }}
                variant="standard"
                value={vehicle?.insurance}
                required
                onChange={(e) => {
                  setVehicle((prevVehicle) => ({
                    ...prevVehicle,
                    insurance: e.target.value,
                  }));
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                className="insuranceNumber"
                id="insuranceNumber"
                label="Número de Adeguradora"
                type="number"
                sx={{ pb: 2 }}
                variant="standard"
                value={vehicle?.insuranceNumber}
                required
                onChange={(e) => {
                  setVehicle((prevVehicle) => ({
                    ...prevVehicle,
                    insuranceNumber: e.target.value,
                  }));
                }}
              />
              <TextField
                className="brand"
                id="brand"
                label="Marca"
                type="text"
                sx={{ pb: 2 }}
                variant="standard"
                value={vehicle?.brand}
                required
                onChange={(e) => {
                  setVehicle((prevVehicle) => ({
                    ...prevVehicle,
                    brand: e.target.value,
                  }));
                }}
              />
              <TextField
                className="model"
                id="model"
                label="Modelo"
                type="text"
                sx={{ pb: 2 }}
                variant="standard"
                value={vehicle?.model}
                required
                onChange={(e) => {
                  setVehicle((prevVehicle) => ({
                    ...prevVehicle,
                    model: e.target.value,
                  }));
                }}
              />
              <TextField
                className="year"
                id="year"
                label="Año"
                type="number"
                sx={{ pb: 2 }}
                variant="standard"
                value={vehicle?.year}
                required
                onChange={(e) => {
                  setVehicle((prevVehicle) => ({
                    ...prevVehicle,
                    year: parseInt(e.target.value), // Convertir a número
                  }));
                }}
              />
              <TextField
                className="colour"
                id="colour"
                label="Color"
                type="text"
                sx={{ pb: 2 }}
                variant="standard"
                value={vehicle?.color}
                required
                onChange={(e) => {
                  setVehicle((prevVehicle) => ({
                    ...prevVehicle,
                    color: e.target.value,
                  }));
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            sx={{ marginTop: 5 }}
            onClick={() => handleSave()}
          >
            Guardar
          </Button>
        </CardActions>
      </Card>
      <CustomAlerts params={alert} closeAlert={handleCloseAlert} />
    </Box>
  );
};

export default AddOrEdit;
