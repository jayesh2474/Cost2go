const express = require("express");
const router = express.Router();
const History = require("../models/History");
const verifyToken = require("../middlewares/auth");

// Save new calculation
router.post("/add", verifyToken, async (req, res) => {
  try {
    const newHistory = new History({
      ...req.body,
      userId: req.user.uid, // Add userId from token
    });
    await newHistory.save();
    res.status(201).json(newHistory);
  } catch (err) {
    res.status(500).json({ message: "Error saving calculation" });
  }
});

// Fetch history for logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const history = await History.find({ userId: req.user.uid });
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
});

// Delete a user's history entry
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const history = await History.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid,
    });
    if (!history) return res.status(404).json({ message: "Entry not found" });
    res.status(200).json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting entry" });
  }
});

module.exports = router;
