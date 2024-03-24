import { RequestHandler } from "express-serve-static-core";
import Tracking, { ITrackingDocument } from "../entity/tracking";
import Vehicle from "../entity/vehicle";

export const createTracking: RequestHandler = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.body.vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const tracking = new Tracking({
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    });

    await tracking.save();

    vehicle.tracking.push(tracking.id);
    await vehicle.save();
    return res
      .status(201)
      .json({ message: "Tracking created successfully", tracking });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error creating tracking", error: error.message });
  }
};

export const deleteTracking: RequestHandler = async (req, res) => {
  const trackingFaund = await Tracking.findByIdAndDelete(req.params.id);
  if (!trackingFaund) {
    return res.status(204).json({ message: "Tracking not found" });
  }
  return res.status(200).json({ trackingFaund, message: "Tracking Deleted" });
};

export const getTracking: RequestHandler = async (req, res) => {
  const trackingFaund = await Tracking.findById(req.params.id);
  if (!trackingFaund) {
    return res.status(204).json({ message: "Tracking not found" });
  }
  return res.status(200).json({ trackingFaund, message: "OK" });
};

export const trackingByDate: RequestHandler = async (req, res) => {
  try {
    const vehicleId = req.params.vehicleId;
    const { objectsPerPage, page, filters } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    let query: any = { _id: { $in: vehicle.tracking } };
    if (filters && filters.length > 0) {
      filters.forEach((filter: any) => {
        switch (filter.filter) {
          case "equals":
            const equalDate = new Date(filter.value);
            equalDate.setUTCHours(0, 0, 0, 0);
            console.log(equalDate);
            const endOfDay = new Date(equalDate);
            endOfDay.setUTCHours(23, 59, 59, 999);
            query[filter.column] = {
              $gte: equalDate,
              $lte: endOfDay,
            };
            break;
          case "between":
            const [startDate, endDate] = filter.value.split(",");
            const startOfDay = new Date(startDate);
            startOfDay.setUTCHours(0, 0, 0, 0);
            const endDay = new Date(endDate);
            endDay.setUTCHours(23, 59, 59, 999);
            query[filter.column] = {
              $gte: startOfDay,
              $lte: endDay,
            };
            break;
          default:
            // Manejar filtro no reconocido
            break;
        }
      });
    }

    // Contar total de registros a partir de los filtros
    const total = await Tracking.countDocuments(query);

    let maxPage: number = 0;
    let trackings: ITrackingDocument[] = [];
    if (objectsPerPage < 0) {
      trackings = await Tracking.find(query);
    } else {
      // Aplicar paginación
      const skip = (page - 1) * objectsPerPage;

      // Se aplica la paginación
      trackings = await Tracking.find(query).skip(skip).limit(objectsPerPage);

      // Calcular información de paginación
      maxPage = Math.ceil(total / objectsPerPage);
    }
    const previousPage = page > 1 ? page - 1 : 1;
    const nextPage = page < maxPage ? page + 1 : maxPage;

    return res.json({
      objectsPerPage,
      page,
      maxPage,
      previousPage,
      nextPage,
      total,
      filters,
      list: trackings,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error searching trackings by date",
      error: error.message,
    });
  }
};
