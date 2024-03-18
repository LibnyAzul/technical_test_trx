import { Schema, model } from "mongoose";

const vehicleSchema = new Schema(
  {
    plate: {
      type: String,
      required: true,
      trim: true,
    },
    economicNumber: {
      type: String,
      required: true,
    },
    vim: {
      type: String,
      required: true,
      trim: true,
    },
    seats: {
      type: Number,
      required: true,
      trim: true,
    },
    insurance: {
      type: String,
      required: true,
    },
    insuranceNumber: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
    },
    alive: {
      type: Boolean,
      required: true,
      default: true
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("Vehicle", vehicleSchema);
