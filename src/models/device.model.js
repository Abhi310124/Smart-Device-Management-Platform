import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true }, // e.g. "light", "meter"
    status: {
      type: String,
      enum: ["active", "inactive", "fault"],
      default: "inactive",
    },
    last_active_at: { type: Date, default: null },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// helpful index for querying by last_active_at, type, status
deviceSchema.index({ last_active_at: 1 });
deviceSchema.index({ type: 1, status: 1 });

export default mongoose.model("Device", deviceSchema);
