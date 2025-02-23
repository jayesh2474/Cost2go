const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    distance: Number,
    mileage: Number,
    fuelNeeded: Number,
    fuelCost: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", historySchema);
