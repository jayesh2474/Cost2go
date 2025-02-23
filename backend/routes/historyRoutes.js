const express = require("express");
const router = express.Router();
const History = require("../models/History");

// Save new calculation
router.post("/add", async (req, res) => {
  try {
    const newHistory = new History(req.body);
    await newHistory.save();
    res.status(201).json(newHistory);
  } catch (err) {
    res.status(500).json({ message: "Error saving calculation" });
  }
});

// Fetch all history
router.get("/", async (req, res) => {
  try {
    const history = await History.find();
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
});

// Delete a history entry
router.delete("/:id", async (req, res) => {
  try {
    await History.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting entry" });
  }
});

module.exports = router;
