import express from "express";
import morgan from "morgan";
import config from "./config";
import cors from "cors";
import vehicleRoutes from "./routes/vehicle";
import trackingRoutes from "./routes/tracking";

const app = express();

app.set("port", config.PORT);
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(vehicleRoutes, trackingRoutes);

export default app;
