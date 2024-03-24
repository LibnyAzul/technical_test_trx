import { useEffect, useState } from "react";
import { Box, Card, CardContent, CardHeader, Fab } from "@mui/material";
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

const List = () => {
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<IPagination>(iPagination);
  const [alert, setAlert] = useState<ICustomAlerts>(iCustomAlerts);

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

  useEffect(() => {
    getList();
  }, []);

  const handleCloseAlert = () => setAlert(iCustomAlerts);

  return (
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
            columns={GenerateColumns(navigate, ChangeAlive)}
            getList={getList}
            objectForPagination={pagination}
            setObjectForPagination={setPagination}
          />
        </CardContent>
      </Card>
      <CustomAlerts params={alert} closeAlert={handleCloseAlert} />
    </Box>
  );
};

export default List;
