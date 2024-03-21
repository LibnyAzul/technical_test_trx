import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IVehicle, iVehicle } from "../components/models/vehicle";
import * as VehicleService from "../services/vehicle";

const AddVehicle = () => {
  const history = useNavigate();
  const params = useParams();

  const [vehicle, setVehicle] = useState<IVehicle>(iVehicle);

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

  const handleSaave = async () => {
    // history("/");
  };

  return (
    <Box>
      {/* <Card>
        <CardHeader
          id="title"
        />
        <CardContent
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "100%" } }}
          noValidate
          autoComplete="off"
        >
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
            type="text"
            sx={{ pb: 2 }}
            variant="standard"
            value={vehicle?.year}
            required
            onChange={(e) => {
              setVehicle((prevVehicle) => ({
                ...prevVehicle,
                year: parseInt(e.target.value), 
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

          <Button variant="contained" onClick={() => console.log("guardar")}>
            Guardar
          </Button>
          {/* {isUpdate ? (
            <>
              <FormControlLabel
                value="start"
                control={
                  <Switch
                    color="primary"
                    checked={vehicle.alive}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setVehicle({ ...vehicle, alive: e.target.checked })
                    }
                  />
                }
                label="Estatus: "
                labelPlacement="start"
              />
            </>
          ) : null} */}
        {/* </CardContent> */}
        {/* {user.is_superuser !== undefined &&
        user.is_superuser &&
        users.length > 0 ? (
          <MultiUsersSelect
            users={users}
            usSelected={vehicle.users}
            usersSelected={usersSelected}
            setUsersSelected={setUsersSelected}
          />
        ) : null} */}
        {/* <CardActionsCustomAddOrEdit
          navigate={navigate}
          Save={Save}
          loading={booleans.loading}
          isUpdate={isUpdate}
          disabled={
            vehicle.plates === '' ||
            vehicle.brand === '' ||
            vehicle.colour === ''
          }
        /> */}
      {/* </Card> */}
    </Box>
  );
};

export default AddVehicle;
