// MongoDB - Mongoose
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
const { Schema } = mongoose;

const ShiftsSchema = new Schema(
  {
    date: { type: String },
    status: { type: String },
    hours: { type: Number },
  },
  {
    strict: false,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
    timestamps: true,
  }
);

ShiftsSchema.plugin(updateIfCurrentPlugin, { strategy: "timestamp" });

const Shifts = mongoose.model("shifts", ShiftsSchema);

export default Shifts;
