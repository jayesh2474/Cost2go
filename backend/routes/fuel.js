const express = require("express");
const {
  getFuelPrice,
  saveSearch,
  getAllSearches,
} = require("../controllers/fuelController");
const router = express.Router();

// Route to get fuel price
router.get("/price", getFuelPrice);

// Route to save search history
router.post("/save", saveSearch);

// Route to get all saved searches
router.get("/history", getAllSearches);

module.exports = router;
