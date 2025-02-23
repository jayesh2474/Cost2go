// frontend/src/components/FuelCalculator.js
import React, { useState, useEffect } from "react";
import { saveSearch, fetchHistory, deleteHistoryItem } from "../services/api";

function FuelCalculator() {
  const [distance, setDistance] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuelPrice, setFuelPrice] = useState(0);
  const [fuelNeeded, setFuelNeeded] = useState(null);
  const [totalCost, setTotalCost] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function loadHistory() {
      const data = await fetchHistory();
      setHistory(data);
    }
    loadHistory();
  }, []);

  const handleCalculate = async () => {
    if (!distance || !mileage || !fuelPrice) return;
    const fuel = distance / mileage;
    const cost = fuel * fuelPrice;
    setFuelNeeded(fuel.toFixed(2));
    setTotalCost(cost.toFixed(2));
    const newEntry = { distance, mileage, fuelNeeded: fuel, fuelCost: cost };
    await saveSearch(newEntry);
    setHistory((prev) => [...prev, newEntry]);
  };

  const handleDelete = async (index) => {
    const entryToDelete = history[index];
    await deleteHistoryItem(entryToDelete._id);
    setHistory(history.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-5 p-4 bg-white rounded-xl shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Simple Fuel Cost Calculator
      </h2>
      <div className="space-y-4">
        <input
          type="number"
          placeholder="Enter Distance (km)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Enter Mileage (km/l)"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Enter Fuel Price (₹ per litre)"
          value={fuelPrice}
          onChange={(e) => setFuelPrice(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleCalculate}
          className="bg-blue-600 text-white px-3 py-2 rounded w-full"
        >
          Calculate
        </button>
        {totalCost && (
          <div className="mt-3 text-lg font-semibold text-center">
            Fuel Needed: {fuelNeeded} litres
            <br />
            Total Fuel Cost: ₹{totalCost}
          </div>
        )}
        <div className="mt-5">
          <h3 className="text-xl font-bold mb-2">Calculation History</h3>
          {history.map((item, index) => (
            <div
              key={index}
              className="border p-2 rounded mb-2 flex justify-between items-center"
            >
              <div>
                Distance: {item.distance} km, Mileage: {item.mileage} km/l
                <br />
                Fuel: {item.fuelNeeded.toFixed(2)} l, Cost: ₹
                {item.fuelCost.toFixed(2)}
              </div>
              <button
                onClick={() => handleDelete(index)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FuelCalculator;
