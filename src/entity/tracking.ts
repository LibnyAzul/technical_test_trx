import { Schema, model } from "mongoose";

export interface ITrackingDocument extends Document {
  latitude: string;
  longitude: string;
}

const trackingSchema = new Schema(
  {
    latitude: {
        type: String,
        required: true,
    },
    longitude: {
        type: String,
        required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model<ITrackingDocument>("Tracking", trackingSchema);
