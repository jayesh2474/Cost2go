const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Firebase UID
      required: true,
    },
    distance: Number,
    mileage: Number,
    fuelNeeded: Number,
    fuelCost: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", historySchema);
