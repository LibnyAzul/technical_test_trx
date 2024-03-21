import { useEffect, useState } from "react";
import { Box, Card, CardContent, CardHeader } from "@mui/material";
import * as VehicleService from "../services/vehicle";
import { useNavigate } from "react-router-dom";
import IPagination, { iPagination } from "../components/models/pagination";
import { GenerateColumns, IVehicle } from "../components/models/vehicle";
import DataGrid from "../components/dataGrid";
import Alert from "@mui/material/Alert";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<IPagination>(iPagination);

  const getList = async (): Promise<any> => {
    setLoading(true);
    await VehicleService.getVehicles(pagination).then((data: any) => {
      if (data !== undefined) {
        if ("Error" in data) {
          <Alert severity="error">
            Hubo un error al cargar la lista de Vehiculos
          </Alert>;
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
    await VehicleService.deleteVehicle(id, !alive);
    getList();
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <Box>
      <Card>
        <CardHeader
          action={
            <>
              {/* <CustomButton
                navigate={navigate}
                path="/entity/vehicle/add"
                type="add"
              />
              <CustomButton
                navigate={navigate}
                path="/entity/vehicle/map"
                type="map"
              /> */}
            </>
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
