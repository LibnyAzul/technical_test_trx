import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Fab,
  Grid,
} from "@mui/material";
import * as VehicleService from "../services/vehicle";
import { useNavigate } from "react-router-dom";
import IPagination, { iPagination } from "../components/models/pagination";
import { GenerateColumns, IVehicle } from "../components/models/vehicle";
import DataGrid from "../components/dataGrid";
import AddIcon from "@mui/icons-material/Add";
import CustomAlerts, {
  ICustomAlerts,
  initialState as iCustomAlerts,
} from "../components/alert";
import Modal from "@mui/material/Modal";
import { grey } from "@mui/material/colors";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const List = () => {
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<IPagination>(iPagination);
  const [alert, setAlert] = useState<ICustomAlerts>(iCustomAlerts);
  const [open, setOpen] = useState<boolean>(false);
  const [idDeleted, setIdDeleted] = useState<string>("");

  const handleOpen = (id: string) => {
    setOpen(true);
    setIdDeleted(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getList = async (): Promise<any> => {
    setLoading(true);
    try {
      const data = await VehicleService.GetVehicles(pagination);
      if (data && "Error" in data) {
        setAlert({
          ...alert,
          open: true,
          alert: {
            type: "error",
            message: "Error al cargar la lista de Vehiculos",
          },
        });
      } else {
        let list: IVehicle[] = [];
        if (data && data.list && data.list.length > 0) {
          list = data.list.map((vehicle: IVehicle) => ({
            ...vehicle,
            id: vehicle._id ?? "0",
          }));
        }
        data.list = [];
        data.filters = pagination.filters;
        setPagination(data);
        setVehicles(list);
      }
      setLoading(false);
    } catch (error) {
      setAlert({
        ...alert,
        open: true,
        alert: {
          type: "error",
          message: "Error al cargar la lista de Vehiculos",
        },
      });
      setLoading(false);
    }
  };

  const ChangeAlive = async (id: string, alive: boolean): Promise<any> => {
    const data = await VehicleService.DisabledVehicle(id, !alive);

    if (data) {
      setAlert({
        ...alert,
        open: true,
        alert: {
          type: "success",
          message: data.message,
        },
      });
      getList();
    } else {
      setAlert({
        ...alert,
        open: true,
        alert: {
          type: "error",
          message: "Hubo un error al cambiar el estado del vehículo.",
        },
      });
    }
  };

  const Delete = async (id: string): Promise<any> => {
    const data = await VehicleService.DeletedVehicle(id);
    if (data) {
      setAlert({
        ...alert,
        open: true,
        alert: {
          type: "success",
          message: data.message,
        },
      });
      getList();
      handleClose();
    } else {
      setAlert({
        ...alert,
        open: true,
        alert: {
          type: "error",
          message: "Hubo un error al eliminar el vehículo.",
        },
      });
    }
  };

  useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  return (
    <>
      <Box>
        <Card>
          <CardHeader
            action={
              <Fab
                color="primary"
                size="small"
                aria-label="add"
                onClick={() => navigate("/vehicle/new-vehicle")}
              >
                <AddIcon />
              </Fab>
            }
            id="parent-modal-description"
            title="Vehículos"
          />
          <CardContent>
            <DataGrid
              loading={loading}
              list={vehicles}
              columns={GenerateColumns(navigate, ChangeAlive, handleOpen)}
              getList={getList}
              objectForPagination={pagination}
              setObjectForPagination={setPagination}
            />
          </CardContent>
        </Card>
        <CustomAlerts params={alert} closeAlert={handleCloseAlert} />
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 500 }}>
          <h2 id="child-modal-title">Estimado Usuario</h2>
          <p id="child-modal-description">
            ¿Esta seguro de que desea elimar el vehiculo?
          </p>
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={5}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => Delete(idDeleted)}
              >
                Eliminar
              </Button>
            </Grid>
            <Grid item xs={5}>
              <Button
                fullWidth
                sx={{
                  backgroundColor: grey[500],
                  "&:hover": {
                    backgroundColor: grey[700],
                  },
                  color: "white",
                }}
                onClick={handleClose}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default List;
