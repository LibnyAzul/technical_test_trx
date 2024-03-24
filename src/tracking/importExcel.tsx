import { Box, Button, Grid, Skeleton, Typography, styled } from "@mui/material";
import { FC, useState } from "react";
import { IVehicle } from "../components/models/vehicle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as XLSX from "xlsx";
import { ITracking } from "../components/models/tracking";
import _ from "lodash";
import { saveAll } from "../services/tracking";

interface IProps {
  setAlert: any;
  vehicle: IVehicle;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const validateDateString = (dateString: string): boolean => {
    // Expresión regular para validar el formato YYYY-MM-DD HH:MM:SS
    const dateTimeRegex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

    // Dividir el string en dos partes usando el espacio como referencia
    const [datePart, timePart] = dateString.split(" ");

    // Validar el formato de la fecha
    if (!dateTimeRegex.test(dateString)) {
      return false;
    }

    // Dividir la parte de la fecha en tres partes usando el guion medio como referencia
    const [year, month, day] = datePart.split("-");

    // Validar el año, mes y día
    if (year.length !== 4 || month.length !== 2 || day.length !== 2) {
      return false;
    }

    // Dividir la parte de la hora en tres partes usando los dos puntos como referencia
    const [hours, minutes, seconds] = timePart.split(":");

    // Validar las horas, minutos y segundos
    if (hours.length !== 2 || minutes.length !== 2 || seconds.length !== 2) {
      return false;
    }

    // Validar que todas las partes sean numéricas
    const isNumeric = (str: string): boolean => /^\d+$/.test(str);
    if (
      !isNumeric(year) ||
      !isNumeric(month) ||
      !isNumeric(day) ||
      !isNumeric(hours) ||
      !isNumeric(minutes) ||
      !isNumeric(seconds)
    ) {
      return false;
    }

    // Validar que los valores de los meses estén en el rango correcto (1-12)
    const monthNumber = parseInt(month, 10);
    if (monthNumber < 1 || monthNumber > 12) {
      return false;
    }

    // Validar que los valores de los días estén en el rango correcto (1-31)
    const dayNumber = parseInt(day, 10);
    if (dayNumber < 1 || dayNumber > 31) {
      return false;
    }

    // Validar que los valores de las horas estén en el rango correcto (0-23)
    const hoursNumber = parseInt(hours, 10);
    if (hoursNumber < 0 || hoursNumber > 23) {
      return false;
    }

    // Validar que los valores de los minutos estén en el rango correcto (0-59)
    const minutesNumber = parseInt(minutes, 10);
    if (minutesNumber < 0 || minutesNumber > 59) {
      return false;
    }

    // Validar que los valores de los segundos estén en el rango correcto (0-59)
    const secondsNumber = parseInt(seconds, 10);
    if (secondsNumber < 0 || secondsNumber > 59) {
      return false;
    }

    // Si pasa todas las validaciones, retorna true
    return true;
  };

const ImportExcel: FC<IProps> = ({ setAlert, vehicle }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSave = async (saveList: ITracking[]) => {
    let isSaved: boolean = false;
    let message: string = "";

    if (saveList.length > 0) {
      await saveAll(String(vehicle._id), saveList).then((data: any) => {
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
  };

  const handleExport = () => {
    // Crear un nuevo libro de Excel
    const workbook = XLSX.utils.book_new();
    // Crear una hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet([]);
    // Establecer los encabezados de las columnas
    XLSX.utils.sheet_add_aoa(worksheet, [["Latitud", "Longitud", "Fecha"]], {
      origin: "A1",
    });
    // Agregar la hoja de cálculo al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, "Coors");
    // Guardar el libro como archivo Excel
    XLSX.writeFile(workbook, `Coordenadas ${new Date()}.xlsx`);
  };

  const handleImport = async (e: any) => {
    setLoading(true);
    const promise = new Promise((resolve, reject) => {
      try {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(e.target.files[0]);

        fileReader.onload = (e: any) => {
          const bufferArray = e.target.result;

          const wb = XLSX.read(bufferArray, { type: "buffer" });
          const wsName = wb.SheetNames[0];
          const ws = wb.Sheets[wsName];
          const data = XLSX.utils.sheet_to_json(ws);

          resolve(data);
        };

        fileReader.onerror = (e: any) => {
          reject(e);
        };
      } catch (e) {
        reject(e);
      }
    });

    promise
      .then(async (data: any) => {
        // Verificamos que el archivo contenga datos.
        if (data.length > 0) {
          let haveError: boolean = false;
          const newList: ITracking[] = data
            .filter((t: any) => {
              // Filtrar elementos con latitud y longitud válidas
              return !(
                _.isNil(t.Latitud) ||
                t.Latitud === "" ||
                _.isNil(t.Longitud) ||
                t.Longitud === ""
              );
            })
            .map((t: any) => {
              const tracking: ITracking = {
                latitude: t.Latitud,
                longitude: t.Longitud,
              };

              // Validar y asignar la fecha si está presente y es válida
              if (!_.isNil(t.Fecha) && t.Fecha !== "") {
                const fechaString = String(t.Fecha);
                if (validateDateString(fechaString)) {
                  tracking.createdAt = `${fechaString.replace(
                    " ",
                    "T"
                  )}.000+00:00`;
                } else {
                  haveError = true;
                }
              }

              return tracking;
            });
          if (haveError) {
            setAlert({
              ...alert,
              open: true,
              alert: {
                type: "error",
                message:
                  "Una o más coordenadas ingresadas no cumplen con el formato correcto de la fecha.",
              },
            });
          } else {
            await handleSave(newList);
          }
        } else {
          setAlert({
            ...alert,
            open: true,
            alert: {
              type: "error",
              message: "El archivo está vacío!",
            },
          });
        }
      })
      .catch((e: any) => {
        setAlert({
          ...alert,
          open: true,
          alert: {
            type: "error",
            message: "Error inesperado, contacte al administrador del sistema.",
          },
        });
      });

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        ml: "4rem",
      }}
    >
      <Skeleton
        sx={{
          bgcolor: "grey.400",
          display: loading ? "block" : "none",
        }}
        variant="rounded"
        width="100%"
        height={400}
      />
      <Grid
        container
        sx={{
          flexDirection: "row",
          justifyContent: "center",
          textAlign: "start",
          display: !loading ? "block" : "none",
        }}
        spacing={2}
      >
        <Grid item xs={12} md={12} lg={12}>
          <Typography variant="h6" gutterBottom mt={2}>
            A continuación se te brindara el contexto necesario para la
            implementación de esta pestaña…
          </Typography>
          <Typography variant="body1" gutterBottom mt={2}>
            El siguiente botón:{" "}
            {
              <Button variant="text" onClick={handleExport}>
                Descargar
              </Button>
            }
            , te permite obtener el template necesario para la importación de
            las coordenadas en el vehículo con matrícula:{" "}
            {<b>{vehicle.plate}</b>}, a continuación la descripción de su
            contenido:
          </Typography>
          <Typography variant="body1" gutterBottom mt={2}>
            En la Columna “A” fila #1, podrás encontrar el título de la misma:
            “Latitud” (19.407284909983332), indica que debes ingresar las
            latitudes de las coordenadas que pretendes ingresar en esta columna,
            en las filas consecutivas.
          </Typography>
          <Typography variant="body1" gutterBottom mt={2}>
            En la Columna “B” fila #1, podrás encontrar el título de la misma:
            “Longitud” (-99.14435051803017), indica que debes ingresar las
            longitudes de las coordenadas que pretendes ingresar en esta
            columna, en las filas consecutivas.
          </Typography>
          <Typography variant="body1" gutterBottom mt={2}>
            Opcional) En la Columna “C” fila #1, podrás encontrar el título de
            la misma: “Fecha”, indica que debes ingresar las fechas de las
            coordenadas tal como fueron registradas, con el formato: "Año-Mes-Día
            Hora:Minutos:Segundos", por ejemplo: "2024-03-22 23:07:19", este es
            un campo opcional y de no encontrarse se ingresará la fecha actual.
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          flexDirection: "row",
          justifyContent: "center",
          textAlign: "center",
          display: !loading ? "block" : "none",
          mt: "2rem"
        }}
        spacing={2}
      >
        <Grid item xs={12} md={12} lg={12}>
          <Button
            component="label"
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            onChange={handleImport}
          >
            Importar Coordenadas
            <VisuallyHiddenInput type="file" accept=".xlsx, .xls" />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ImportExcel;
