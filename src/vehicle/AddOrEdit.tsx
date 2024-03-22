import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Fab,
  Grid,
  Snackbar,
  TextField,
} from "@mui/material";
import Alert, { AlertColor } from "@mui/material/Alert";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IVehicle, iVehicle } from "../components/models/vehicle";
import * as VehicleService from "../services/vehicle";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

const AddOrEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [vehicle, setVehicle] = useState<IVehicle>(iVehicle);

  const [typeAlert, setTypeAlert] = useState<AlertColor>();
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");

  const isUpdate = "id" in params;

  const getVehicle = async (id: string) => {
    const res = await VehicleService.getVehicle(id);
    const datas: IVehicle = res.data;
    setVehicle(datas);
  };

  useEffect(() => {
    if (params && params.id) {
      getVehicle(params.id);
    }
  }, [params]);

  const handleSave = async () => {
    let message: string = 'Ocurrio un incidente inesperado!';
    let isSaveOrUpdate: boolean = false;

    if (isUpdate) {
      await VehicleService.updateVehicle(params.id ?? '', vehicle).then((data: any) => {
        isSaveOrUpdate = data.response.status === 200;
        message = data.response.data.message;
        console.log(data.response.data);
      });
    } else {
      await VehicleService.createVehicle(vehicle).then((data: any) => {
        isSaveOrUpdate = data.response.status === 200;
        message = data.response.data.message;
      });
    }
    
    setTextAlert(message);
    setTypeAlert(isSaveOrUpdate ? "success" : "error");
    setShowAlert(true);

    setTimeout(() => {
      if (isSaveOrUpdate) navigate("/");
    }, 1000);
  };

  return (
    <Box>
      <Card>
        <CardHeader
          action={
            <Fab
              color="primary"
              size="small"
              aria-label="add"
              onClick={() => navigate("/")}
            >
              <FormatListNumberedIcon />
            </Fab>
          }
          id="title"
          title={(isUpdate ? "Editar" : "Agregar") + " Vehìculo"}
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
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
      >
        <Alert
          onClose={() => setShowAlert(false)}
          severity={typeAlert}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {textAlert}
        </Alert>
      </Snackbar>
      {/* <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={showAlert}
        onClose={() => setShowAlert(false)}
        message={`${textAlert}`}
      /> */}
    </Box>
  );
};

export default AddOrEdit;
