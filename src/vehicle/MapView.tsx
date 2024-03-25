import React, { useEffect, useState } from "react";
import Map from "../components/map";
import { useNavigate, useParams } from "react-router-dom";
import { IVehicle, iVehicle } from "../components/models/vehicle";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Fab,
  Grid,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import CustomAlerts, {
  ICustomAlerts,
  initialState as iCustomAlerts,
} from "../components/alert";
import _ from "lodash";
import { GetVehicleById } from "../services/vehicle";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import IPagination, {
  IFilter,
  iPagination,
} from "../components/models/pagination";
import { findByIdAndFilters } from "../services/tracking";
import { ITracking } from "../components/models/tracking";
import GpsOffIcon from "@mui/icons-material/GpsOff";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  boxShadow:
    "0px 10px 10px -1px rgba(0,0,0,0.2), 0px 2px 2px 0px rgb(0 0 0 / 8%), 0px 1px 10px 0px rgba(0,0,0,0.12)",
}));

const MapView = () => {
  const [vehicle, setVehicle] = useState<IVehicle>(iVehicle);
  const [alert, setAlert] = useState<ICustomAlerts>(iCustomAlerts);
  const navigate = useNavigate();
  const params = useParams();
  const [filterDate, setFilterDate] = useState<Dayjs | null>(null);
  const [coors, setCoors] = useState<google.maps.LatLngLiteral[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);

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

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  const handlefilters = async () => {
    var pg: IPagination = {
      page: 1,
      objectsPerPage: 25,
      maxPage: 1,
      filters: [],
    };
    setNotFound(false);
    if (filterDate !== null) {
      setLoading(true);
      const filter: IFilter = {
        column: "createdAt",
        filter: "equals",
        value: String(filterDate?.format("YYYY-MM-DD")),
      };
      pg.filters[0] = filter;
      pg.objectsPerPage = -1;

      await findByIdAndFilters(String(vehicle._id), pg).then(
        (data: IPagination | any) => {
          if ("list" in data) {
            if (data.list.length > 0) {
              const trackings: ITracking[] = data.list;
              const coorsByTrackins: google.maps.LatLngLiteral[] = [];
              // eslint-disable-next-line array-callback-return
              trackings.map((tracking: ITracking) => {
                coorsByTrackins.push({
                  lat: Number(tracking.latitude),
                  lng: Number(tracking.longitude),
                });
              });
              setCoors(coorsByTrackins);
              pg = { ...data, list: [] };
            } else {
              setCoors([]);
              setNotFound(true);
            }
          } else {
            setAlert({
              ...alert,
              open: true,
              alert: {
                type: "error",
                message:
                  "message" in data
                    ? data.message
                    : "Error al buscar los datos de la ruta.",
              },
            });
          }
        }
      );
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (params.id) {
      loadEntity(params.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  return (
    <Box>
      <Card>
        <CardHeader
          action={
            <Fab
              color="primary"
              size="small"
              aria-label="home"
              onClick={() => navigate(-1)}
            >
              <FormatListNumberedIcon />
            </Fab>
          }
          id="title"
          title={
            <Item sx={{ height: "100%", width: "30%" }}>
              <Typography variant="h6">
                {`Vehículo con matricula: ${vehicle.plate}`}
              </Typography>
            </Item>
          }
        />
        <CardContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container sx={{ flexDirection: "row" }} spacing={2}>
              <Grid item xs={4} md={5} lg={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label="Seleccione una fecha"
                      // disableFuture
                      format="DD/MM/YYYY"
                      value={filterDate}
                      onChange={(value) => {
                        setFilterDate(value);
                        setCoors([]);
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <Button
                  variant="contained"
                  sx={{ marginTop: 5 }}
                  onClick={() => handlefilters()}
                >
                  {"Filtrar"}
                </Button>
              </Grid>
              <Grid item xs={8} md={7} lg={8} spacing={4}>
                <Skeleton
                  sx={{
                    bgcolor: "grey.400",
                    display: loading ? "block" : "none",
                  }}
                  variant="rounded"
                  width="100%"
                  height={400}
                />
                {!loading && notFound ? (
                  <Grid
                    container
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                    spacing={2}
                  >
                    <Item>
                      <GpsOffIcon sx={{ color: grey.A700, fontSize: 50 }} />
                      <Typography variant="h4" component="h5">
                        {"No se encontraron datos para la fecha seleccionada."}
                      </Typography>
                    </Item>
                  </Grid>
                ) : null}
                {coors.length > 0 && !loading ? (
                  <Map coors={coors} vehicle={vehicle} />
                ) : null}
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <CardActions></CardActions>
      </Card>
      <CustomAlerts params={alert} closeAlert={handleCloseAlert} />
    </Box>
  );
};

export default MapView;
