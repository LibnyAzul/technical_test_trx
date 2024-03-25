import { RequestHandler } from "express-serve-static-core";
import Tracking, { ITrackingDocument } from "../entity/tracking";
import Vehicle from "../entity/vehicle";

export const createTracking: RequestHandler = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.body.vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
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
      .json({ message: "Las coordenadas se han guardado correctamente", tracking });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al crear las coordenadas", error: error.message });
  }
};

export const deleteTracking: RequestHandler = async (req, res) => {
  const trackingFaund = await Tracking.findByIdAndDelete(req.params.id);
  if (!trackingFaund) {
    return res.status(204).json({ message: "Coordenadas no encontradas" });
  }
  return res.status(200).json({ trackingFaund, message: "Coordenadas eliminadas" });
};

export const getTracking: RequestHandler = async (req, res) => {
  const trackingFaund = await Tracking.findById(req.params.id);
  if (!trackingFaund) {
    return res.status(204).json({ message: "Coordenadas no encontradas" });
  }
  return res.status(200).json({ trackingFaund, message: "OK" });
};


export const trackingByDate: RequestHandler = async (req, res) => {
  try {
    const vehicleId = req.params.vehicleId;
    const { objectsPerPage, page, filters } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }

    let query: any = { _id: { $in: vehicle.tracking } };
    if (filters && filters.length > 0) {
      filters.forEach((filter: any) => {
        switch (filter.filter) {
          case "equals":
            const equalDate = new Date(filter.value);
            equalDate.setUTCHours(0, 0, 0, 0);
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
      message: "Error al buscar las coodenadas por decha",
      error: error.message,
    });
  }
};

export const saveAll: RequestHandler = async (req, res) => {
  try {
    const vehicleId = req.params.vehicleId; // Assuming vehicleId is in URL params

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }

    const trackings = req.body; // Cast body to Tracking[]

    // Validate trackings
    const validTrackings = trackings.filter((tracking: { latitude: any; longitude: any; }) => {
      if (!tracking.latitude || !tracking.longitude) {
        return false; // Missing required properties
      }
      return true;
    });

    if (validTrackings.length === 0) {
      return res.status(400).json({ message: "No se proporcionaron datos validos" });
    }

    // Create and save trackings
    const savedTrackings = await Promise.all(
      validTrackings.map(async (tracking: { latitude: any; longitude: any; createdAt: string | number | Date; }) => {
        const newTracking = new Tracking({
          latitude: tracking.latitude,
          longitude: tracking.longitude,
          createdAt: tracking.createdAt ? new Date(tracking.createdAt) : undefined, // Set createDate if provided 
        });
        await newTracking.save();
        return newTracking;
      })
    );

    // Update vehicle with saved tracking IDs
    vehicle.tracking.push(...savedTrackings.map((t) => t._id));
    await vehicle.save();

    return res
      .status(201)
      .json({ message: "Coordenas creadas correctamente", trackings: savedTrackings });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al crear las coordenadas", error: error.message });
  }
};

