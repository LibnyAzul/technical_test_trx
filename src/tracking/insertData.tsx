import { Box, Fab, Grid, TextField } from "@mui/material";
import { FC, useState } from "react";
import {
  GenerateColumns,
  ITracking,
  iTracking,
} from "../components/models/tracking";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import _ from "lodash";
import { DataGrid, esES } from "@mui/x-data-grid";
import { IVehicle } from "../components/models/vehicle";
import { saveAll } from "../services/tracking";

interface IProps {
  setAlert: any;
  vehicle: IVehicle;
}

const InsertData: FC<IProps> = ({ setAlert, vehicle }) => {
  const [tracking, setTracking] = useState<ITracking>(iTracking);
  const [list, setList] = useState<ITracking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const removeCoors = (e: any) => {
    setLoading(true);
    if (list.length > 0) {
      const newList: ITracking[] = list.filter(
        (tracking: ITracking) => tracking.id !== Number(e)
      );
      setList(newList);
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const addCoors = () => {
    setLoading(true);
    const key: number = list.length === 0 ? 1 : list.length + 1;
    if (
      !_.isNil(tracking.latitude) &&
      tracking.latitude !== "" &&
      !_.isNil(tracking.longitude) &&
      tracking.longitude !== ""
    ) {
      setList([...list, { ...tracking, id: key }]);
      setTracking(iTracking);
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleSave = async () => {
    setLoading(true);
    let isSaved: boolean = false;
    let message: string = "";

    if (list.length > 0) {
      await saveAll(String(vehicle._id), list).then((data: any) => {
        isSaved = "trackings" in data && data.trackings.length > 0;
        message =
          "message" in data ? data.message : "A occurrido un error inesperado!";
      });
    } else {
      message = "La lista no se puede almacenar vacía!";
    }
    setAlert({
      ...alert,
      open: true,
      alert: {
        type: isSaved ? "success" : "error",
        message,
      },
    });
    if (isSaved) {
      setTracking(iTracking);
      setList([]);
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        justifyContent: "center",
        textAlign: "center",
        ml: "2rem",
      }}
    >
      <Grid container sx={{ flexDirection: "row" }} spacing={2}>
        <Grid item xs={5} md={5} lg={5}>
          <TextField
            className="lat"
            id="lat"
            label="Latitud"
            type="number"
            sx={{ pb: 2 }}
            variant="standard"
            value={tracking?.latitude}
            required
            onChange={(e) =>
              setTracking({ ...tracking, latitude: String(e.target.value) })
            }
          />
        </Grid>
        <Grid item xs={5} md={5} lg={5}>
          <TextField
            className="lng"
            id="lng"
            label="Longitud"
            type="number"
            sx={{ pb: 2 }}
            variant="standard"
            value={tracking?.longitude}
            required
            onChange={(e) =>
              setTracking({ ...tracking, longitude: String(e.target.value) })
            }
          />
        </Grid>
        <Grid item xs={1} md={1} lg={1} sx={{ textAlign: "start" }}>
          <Fab color="primary" size="small" aria-label="add" onClick={addCoors}>
            <AddIcon />
          </Fab>
        </Grid>
        <Grid item xs={1} md={1} lg={1} sx={{ textAlign: "end" }}>
          <Fab
            color="primary"
            size="small"
            aria-label="add"
            onClick={handleSave}
          >
            <SaveIcon />
          </Fab>
        </Grid>
      </Grid>
      <Grid container sx={{ flexDirection: "row" }} spacing={2}>
        <Grid item xs={12} md={12} lg={12}>
          <Box sx={{ height: 400 }}>
            <DataGrid
              loading={loading}
              rows={list}
              columns={GenerateColumns(removeCoors)}
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InsertData;
