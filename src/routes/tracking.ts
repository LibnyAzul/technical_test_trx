import { Router } from "express";
import * as trackingCtr from "../controller/tracking"

const router = Router();

router.post("/tracking", trackingCtr.createTracking);
router.delete("/tracking/:id", trackingCtr.deleteTracking);
router.get("/tracking/:id", trackingCtr.getTracking);

export default router;