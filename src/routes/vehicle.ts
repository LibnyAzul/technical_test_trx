import { Router } from "express";
import * as vehicleCtr from "../controller/vehicle";

const router = Router();

router.post("/vehicle", vehicleCtr.getVehicles);
router.get("/vehicle/:id", vehicleCtr.getVehicle);
router.post("/vehicle/new", vehicleCtr.createVehicle);
router.put("/vehicle/disabled/:id", vehicleCtr.disabledVehicle);
router.delete("/vehicle/:id", vehicleCtr.deleteVehicle);
router.put("/vehicle/:id", vehicleCtr.updateVehicle);
router.get("/vehicle/tracking/:vehicleId", vehicleCtr.getTrackigByVehicle);

export default router;
