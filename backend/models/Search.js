const mongoose = require("mongoose");

const SearchSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  distance: { type: Number, required: true },
  mileage: { type: Number, required: true },
  fuelCost: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Search", SearchSchema);
