import {
  DataGrid,
  GridColumns,
  GridFilterModel,
  esES,
  GridSortModel,
  GridToolbarContainer,
  GridToolbarContainerProps,
} from "@mui/x-data-grid";
import {
  ChangeEvent,
  FC,
  MouseEvent,
  useEffect,
  useState,
} from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  InputLabel,
  NativeSelect,
  Pagination,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import _ from "lodash";
import IPagination, { IFilter } from "./models/pagination";
import Alert from "@mui/material/Alert";

export interface TestDataGridProps {
  /** Params for DataGrid component */
  loading: boolean;
  list: any[];
  columns: GridColumns;
  getList: any;
  size?: number;

  /** Params for DataGrid paination */
  objectForPagination: IPagination;
  setObjectForPagination: any;

  /** Params for Popover animation */
  isPopover?: boolean;

  /** Origin View */
  type?: string;
}

const TestDataGrid: FC<TestDataGridProps> = (props: TestDataGridProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [screenSize, setScreenSize] = useState(windowSize());
  const [item, setItem] = useState<String>("");

  const isPopover: boolean =
    props.isPopover !== undefined
      ? props.isPopover === null
        ? true
        : props.isPopover
      : false;
  //   const type: string =
  //     props.type !== undefined ? (props.type === null ? '' : props.type) : '';
  const size: number = !_.isNil(props.size) ? props.size : 0.8;

  /** Function used to obtain screen size */
  function windowSize(): any {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }
  /** End */

  /** Layout used to indicate that there are no records to display in the table */
  const StyledGridOverlay = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    "& .ant-empty-img-1": {
      fill: theme.palette.mode === "light" ? "#aeb8c2" : "#262626",
    },
    "& .ant-empty-img-2": {
      fill: theme.palette.mode === "light" ? "#f5f5f7" : "#595959",
    },
    "& .ant-empty-img-3": {
      fill: theme.palette.mode === "light" ? "#dce0e6" : "#434343",
    },
    "& .ant-empty-img-4": {
      fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
    },
    "& .ant-empty-img-5": {
      fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
      fill: theme.palette.mode === "light" ? "#342323bf" : "#fff",
    },
  }));

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function CustomNoRowsOverlay() {
    return (
      <StyledGridOverlay>
        <svg
          width="120"
          height="100"
          viewBox="0 0 184 152"
          aria-hidden
          focusable="false"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(24 31.67)">
              <ellipse
                className="ant-empty-img-5"
                cx="67.797"
                cy="106.89"
                rx="67.797"
                ry="12.668"
              />
              <path
                className="ant-empty-img-1"
                d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
              />
              <path
                className="ant-empty-img-2"
                d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
              />
              <path
                className="ant-empty-img-3"
                d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
              />
            </g>
            <path
              className="ant-empty-img-3"
              d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
            />
            <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
              <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
              <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
            </g>
          </g>
        </svg>
        <Box sx={{ mt: 1 }}>{"No se encontraron registros"}</Box>
      </StyledGridOverlay>
    );
  }
  /** End */

  /** Method used to process the filters of the table, and to be able to use the potential of the Backend developed */
  const Filters = (e: GridFilterModel): void => {
    const pagination = props.objectForPagination;
    const filters: IFilter[] =
      !_.isNil(pagination.filters) && pagination.filters.length > 0
        ? pagination.filters.filter(
            (item: any) => item.filter === "asc" && item.filter === "desc"
          )
        : [];
    if (e.items.length > 0) {
      const init: any = e.items;
      // eslint-disable-next-line array-callback-return
      init.map((filterItem: any) => {
        if (filterItem.value !== undefined && filterItem.value !== "") {
          let operatorValue = "";
          switch (filterItem.operatorValue) {
            case "=":
            case "equals":
            case "exact":
            case "is":
              operatorValue = "exact";
              break;
            case ">":
            case "gt":
              operatorValue = "gt";
              break;
            case ">=":
            case "gte":
              operatorValue = "gte";
              break;
            case "!=":
            case "distinct":
              operatorValue = "distinct";
              break;
            case "contains":
              operatorValue = "contains";
              break;
            case "isAnyOf":
            case "isEmpty":
            case "isNotEmpty":
            case "startsWith":
            case "endsWith":
              operatorValue = filterItem.operatorValue;
              break;
            default:
              break;
          }
          if (operatorValue !== "") {
            const filter: IFilter = {
              column: filterItem.columnField,
              filter: operatorValue,
              value:
                filterItem.value === "true"
                  ? true
                  : filterItem.value === "false"
                  ? false
                  : filterItem.value,
            };
            filters.push(filter);
          } else {
            <Alert severity="error">
              {`Por el momento no se cuenta con el filtro: "${String(filterItem.operatorValue)}".`}
            </Alert>
          }
        } else if (
          filterItem.operatorValue === "isEmpty" ||
          filterItem.operatorValue === "isNotEmpty"
        ) {
          const filter: IFilter = {
            column: filterItem.columnField,
            filter: filterItem.operatorValue,
            value: null,
          };
          filters.push(filter);
        }
      });
    }
    pagination.filters = filters;
    props.setObjectForPagination(pagination);
    props.getList();
  };
  /** End */

  /** Method used to process and implement the paging of the table, and to be able to use the potential of the Backend developed */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function Paginated() {
    const pagination = props.objectForPagination;
    return props.list.length > 0 ? (
      <Stack direction="row" spacing={1}>
        <InputLabel>{"Filas por página:"}</InputLabel>
        <NativeSelect
          defaultValue={pagination.objectsPerPage}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            console.log("Event: ", e.target.value);
            pagination.objectsPerPage = parseInt(e.target.value);
            props.setObjectForPagination(pagination);
            props.getList();
          }}
        >
          <option value={10}>{"10"}</option>
          <option value={25}>{"25"}</option>
          <option value={50}>{"50"}</option>
          <option value={100}>{"100"}</option>
          <option value={pagination.total}>{"Todos"}</option>
        </NativeSelect>
        <Pagination
          count={props.objectForPagination.maxPage}
          page={props.objectForPagination.page}
          variant="outlined"
          color="primary"
          onChange={(_i: any, value: any) => {
            pagination.page = value;
            props.setObjectForPagination(pagination);
            props.getList();
          }}
        />
      </Stack>
    ) : (
      <></>
    );
  }
  /** End */

  /** Method used to process and implement the order in the data of the table, and to be able to use the potential of the Backend developed */
  const Sort = (e: GridSortModel): void => {
    const pagination = props.objectForPagination;
    const filters: IFilter[] =
      !_.isNil(pagination.filters) && pagination.filters.length > 0
        ? pagination.filters.filter(
            (item: any) => item.value !== "asc" && item.value !== "desc"
          )
        : [];
    if (e.length > 0) {
      // eslint-disable-next-line array-callback-return
      e.map((filterItem: any) => {
        const filter: IFilter = {
          column: filterItem.field,
          filter: "orderBy",
          value: filterItem.sort,
        };
        filters.push(filter);
      });
    }
    pagination.filters = filters;
    props.setObjectForPagination(pagination);
    props.getList();
  };
  /** End */

  const openPopover = (e: MouseEvent<HTMLElement>): void => {
    const field = e.currentTarget.dataset.field ?? "";
    const id = e.currentTarget.parentElement?.dataset.id ?? null;
    const row: any = props.list.filter(
      (object: any) => Number(object.id) === Number(id)
    );
    if (field !== "actions" && field !== "alive") {
      setItem(row[0][field]);
      setAnchorEl(e.currentTarget);
    }
  };

  const closePopover = (): void => {
    setAnchorEl(null);
  };

  /** Custom Grid Tool Bar for Custom Exports */
  // const getJson = (apiRef: MutableRefObject<GridApi>): string => {
  //   // Select rows and columns
  //   const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
  //   const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef);

  //   // Format the data. Here we only keep the value
  //   const data = filteredSortedRowIds.map((id) => {
  //     const row: Record<string, any> = {};
  //     visibleColumnsField.forEach((field) => {
  //       row[field] = apiRef.current.getCellParams(id, field).value;
  //     });
  //     return row;
  //   });

    // Stringify with some indentation
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#parameters
  //   console.log("data:_ ", data);
  //   return JSON.stringify(data, null, 2);
  // };

  // const exportBlob = (blob: Blob, fileName: string): void => {
  //   // Save the blob in a json file
  //   const url = URL.createObjectURL(blob);

  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = fileName;
  //   a.click();

  //   setTimeout(() => {
  //     URL.revokeObjectURL(url);
  //   });
  // };

  // const JsonExportMenuItem: FC<GridExportMenuItemProps<{}>> = (
  //   props: GridExportMenuItemProps<{}>
  // ) => {
  //   const apiRef = useGridApiContext();
  //   const { hideMenu } = props;
  //   return (
  //     <MenuItem
  //       onClick={() => {
  //         const jsonString = getJson(apiRef);
  //         const blob = new Blob([jsonString], {
  //           type: "text/json",
  //         });
  //         exportBlob(blob, "Portal_OE.json");

  //         // Hide the export menu after the export
  //         hideMenu?.();
  //       }}
  //     >
  //       {"Exportar Json"}
  //     </MenuItem>
  //   );
  // };

  // const CustomExportButtons: FC<ButtonProps> = (props: ButtonProps) => (
  //   <GridToolbarExportContainer placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} {...props}>
  //     <GridCsvExportMenuItem {...props} />
  //     <GridPrintExportMenuItem {...props} />
  //     <JsonExportMenuItem />
  //   </GridToolbarExportContainer>
  // );
  //   const CustomExportButtons = (props: ButtonProps) => (
  //     <GridToolbarExportContainer {...props}>
  //       <GridCsvExportMenuItem {...props} />
  //       <GridPrintExportMenuItem {...props} />
  //       <JsonExportMenuItem />
  //     </GridToolbarExportContainer>
  //   );

  const CustomToolBar: FC<GridToolbarContainerProps> = (
    props: GridToolbarContainerProps
  ) => (
    <GridToolbarContainer {...props}>
      {/* <GridToolbarColumnsButton placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
      <GridToolbarFilterButton placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
      <GridToolbarDensitySelector placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
      <CustomExportButtons /> */}
    </GridToolbarContainer>
  );
  //   const CustomToolBar = (props: GridToolbarContainerProps) => (
  //     <GridToolbarContainer {...props}>
  //       <GridToolbarColumnsButton />
  //       <GridToolbarFilterButton />
  //       <GridToolbarDensitySelector />
  //       <CustomExportButtons />
  //     </GridToolbarContainer>
  //   );
  /** End */

  useEffect(() => {
    /** This code is implemented to detect the size in pixels of the screen, to be able to set them in the table component (it does not take percentages). */
    function handleWindowResize(): void {
      setScreenSize(windowSize());
    }
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
    /** End */
  }, []);

  return (
    <Box sx={{ height: screenSize.innerHeight * size }}>
      <DataGrid
        loading={props.loading}
        columns={props.columns}
        rows={props.list}
        onFilterModelChange={Filters}
        onSortModelChange={Sort}
        components={{
          Toolbar: CustomToolBar,
          Pagination: Paginated,
          NoRowsOverlay: CustomNoRowsOverlay,
          NoResultsOverlay: CustomNoRowsOverlay,
        }}
        componentsProps={
          isPopover
            ? {
                cell: {
                  onMouseEnter: openPopover,
                  onMouseLeave: closePopover,
                },
              }
            : {}
        }
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
      />
      <Popover
        sx={{ pointerEvents: "none" }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        onClose={closePopover}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{item}</Typography>
      </Popover>
    </Box>
  );
};

export default TestDataGrid;
