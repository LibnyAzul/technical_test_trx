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

