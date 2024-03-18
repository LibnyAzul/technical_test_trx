import { Router } from "express";
import * as vehicleCtr from "./vehicle.controller";

const router = Router();

router.get("/vehicle", vehicleCtr.getVehicles);
router.get("/vehicle/:id", vehicleCtr.getVehicle);
router.post("/vehicle", vehicleCtr.createVehicle);
router.put("/vehicle/disabled/:id", vehicleCtr.deleteVehicle);
router.put("/vehicle/:id", vehicleCtr.updateVehicle);
router.post("/vehicle/search/:fieldName/:searchValue", vehicleCtr.searchVehicleByField);

export default router;
