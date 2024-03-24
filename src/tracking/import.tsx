import React, { FC, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Fab,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { IVehicle, iVehicle } from "../components/models/vehicle";
import { GetVehicleById } from "../services/vehicle";
import CustomAlerts, {
  ICustomAlerts,
  initialState as iCustomAlerts,
} from "../components/alert";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import _ from "lodash";
import { Item } from "../vehicle/MapView";
import InsertData from "./insertData";
import ImportExcel from "./importExcel";
import ImportCSV from "./importCSV";

const Imp: FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<IVehicle>(iVehicle);
  const [alert, setAlert] = useState<ICustomAlerts>(iCustomAlerts);
  const [value, setValue] = React.useState(0);

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

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const allProps = (index: number) => {
    return {
      id: `vertical-tab-${index}`,
      "aria-controls": `vertical-tabpanel-${index}`,
    };
  };

  useEffect(() => {
    if (params && params.id) {
      loadEntity(params.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

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
          title={
            <Item>
              <Typography variant="h6">
                {`Importar datos para el vehiculo con matricula: ${vehicle.plate}`}
              </Typography>
            </Item>
          }
        />
        <CardContent
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "100%" } }}
          noValidate
          autoComplete="off"
        >
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: "background.paper",
              display: "flex",
              height: 600,
            }}
          >
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={{ borderRight: 1, borderColor: "divider" }}
            >
              <Tab label="Insertar datos" {...allProps(0)} />
              <Tab label="Importar Excel" {...allProps(1)} />
              <Tab label="Importar CSV" {...allProps(2)} />
            </Tabs>
            <Box
              sx={{
                display: value === 0 ? "block" : "none",
                height: "100%",
                width: "100%",
              }}
              id={`verticalTabPanel-${0}`}
            >
              <InsertData setAlert={setAlert} vehicle={vehicle} />
            </Box>
            <Box
              sx={{
                display: value === 1 ? "block" : "none",
                height: "100%",
                width: "100%",
              }}
              id={`verticalTabPanel-${1}`}
            >
              <ImportExcel setAlert={setAlert} vehicle={vehicle} />
            </Box>
            <Box
              sx={{
                display: value === 2 ? "block" : "none",
                height: "100%",
                width: "100%",
              }}
              id={`verticalTabPanel-${2}`}
            >
              <ImportCSV />
            </Box>
          </Box>
        </CardContent>
      </Card>
      <CustomAlerts params={alert} closeAlert={handleCloseAlert} />
    </Box>
  );
};

export default Imp;
