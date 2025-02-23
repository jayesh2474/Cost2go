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
    <div className="mt-10 p-6 bg-white rounded-2xl shadow-lg max-w-lg mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Fuel Cost Calculator
      </h2>
      <div className="space-y-5">
        <input
          type="number"
          placeholder="Distance (km)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className="border p-3 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Mileage (km/l)"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
          className="border p-3 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Fuel Price (₹/litre)"
          value={fuelPrice}
          onChange={(e) => setFuelPrice(e.target.value)}
          className="border p-3 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleCalculate}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg w-full hover:shadow-xl transition-all duration-300"
        >
          Calculate
        </button>

        {totalCost && (
          <div className="mt-5 p-4 bg-blue-100 rounded-xl text-center">
            <p className="text-lg font-semibold text-blue-700">
              Fuel Needed: {fuelNeeded} litres
            </p>
            <p className="text-lg font-semibold text-blue-700">
              Total Cost: ₹{totalCost}
            </p>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-2xl font-bold mb-3 text-gray-700">
            Calculation History
          </h3>
          {history.length === 0 ? (
            <p className="text-gray-500">No history available.</p>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg mb-3 flex justify-between items-center bg-gray-50 shadow-sm"
              >
                <div>
                  <p className="text-gray-700">
                    Distance: {item.distance} km | Mileage: {item.mileage} km/l
                  </p>
                  <p className="text-gray-700">
                    Fuel: {item.fuelNeeded.toFixed(2)} l | Cost: ₹
                    {item.fuelCost.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-600 hover:text-red-800 transition-all"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FuelCalculator;
