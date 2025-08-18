import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    device_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
      index: true,
    },
    // Log event details
    event: { type: String, required: true }, 
    
    //Log value, can be a number or string
    value: { type: Number, required: false },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

logSchema.index({ device_id: 1, timestamp: -1 });

export default mongoose.model("Log", logSchema);
