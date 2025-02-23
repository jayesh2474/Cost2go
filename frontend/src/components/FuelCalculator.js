import React, { useState, useEffect } from "react";
import { fetchFuelPrice, saveSearch } from "../services/api";

function FuelCalculator() {
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuelPrice, setFuelPrice] = useState(0);
  const [totalCost, setTotalCost] = useState(null);

  useEffect(() => {
    async function getPrice() {
      const price = await fetchFuelPrice();
      setFuelPrice(price);
    }
    getPrice();
  }, []);

  const handleCalculate = async () => {
    if (!distance || !mileage) return;
    const fuelNeeded = distance / mileage;
    const cost = fuelNeeded * fuelPrice;
    setTotalCost(cost.toFixed(2));

    await saveSearch({ destination, distance, mileage, fuelCost: cost });
  };

  return (
    <div className="mt-5 p-4 border rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Calculate Fuel Cost</h2>
      <input
        type="text"
        placeholder="Enter Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="number"
        placeholder="Enter Distance (km)"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="number"
        placeholder="Enter Mileage (km/l)"
        value={mileage}
        onChange={(e) => setMileage(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handleCalculate}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Calculate
      </button>
      {totalCost && (
        <div className="mt-4 text-lg font-bold">
          Total Fuel Cost: ₹{totalCost}
        </div>
      )}
    </div>
  );
}

export default FuelCalculator;
