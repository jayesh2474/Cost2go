const Search = require("../models/Search");

// Mock function to get fuel price
exports.getFuelPrice = async (req, res) => {
  try {
    const fuelPrice = 100; // Mock price in ₹
    res.json({ fuelPrice });
  } catch (error) {
    res.status(500).json({ message: "Error fetching fuel price" });
  }
};

// Function to save search to MongoDB
exports.saveSearch = async (req, res) => {
  const { destination, distance, mileage, fuelCost } = req.body;
  try {
    const newSearch = new Search({ destination, distance, mileage, fuelCost });
    await newSearch.save();
    res.status(201).json(newSearch);
  } catch (error) {
    res.status(500).json({ message: "Error saving search data" });
  }
};

// Get all search history from MongoDB
exports.getAllSearches = async (req, res) => {
  try {
    const searches = await Search.find().sort({ date: -1 });
    res.status(200).json(searches);
  } catch (error) {
    res.status(500).json({ message: "Error fetching search history" });
  }
};
