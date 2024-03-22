import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, CardHeader, Fab } from "@mui/material";
import * as VehicleService from "../services/vehicle";
import { useNavigate } from "react-router-dom";
import IPagination, { iPagination } from "../components/models/pagination";
import { GenerateColumns, IVehicle } from "../components/models/vehicle";
import DataGrid from "../components/dataGrid";
import Alert, { AlertColor } from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<IPagination>(iPagination);
  const [typeAlert, setTypeAlert] = useState<AlertColor>();
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");

  const getList = async (): Promise<any> => {
    setLoading(true);
    await VehicleService.getVehicles(pagination).then((data: any) => {
      if (data !== undefined) {
        if ("Error" in data) {
          setShowAlert(true);
          setTextAlert("Hubo un error al cargar la lista de Vehiculos");
          setTypeAlert("error");
        } else {
          const book = data.data;
          let list: IVehicle[] | any = [];
          if (book.list.length > 0) {
            list = book.list.map((vehicle: IVehicle) => {
              return {
                ...vehicle,
                id: vehicle._id ?? "0",
              };
            });
          }
          book.list = [];
          book.filters = pagination.filters;
          setPagination(book);
          setVehicles(list);
        }
      }
    });
    setLoading(false);
  };

  const ChangeAlive = async (id: string, alive: boolean): Promise<any> => {
    await VehicleService.deleteVehicle(id, !alive).then((data: any) => {
      if (data.status === 200) {
        setShowAlert(true);
        setTextAlert(data.data.message);
        setTypeAlert("success");
      }
    });
    getList();
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <Box>
      {showAlert && (
        <Alert severity={typeAlert} onClose={() => setShowAlert(false)}>
          {textAlert}
        </Alert>
      )}
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
    </Box>
  );
};

export default VehicleList;
