// frontend/src/components/FuelCalculator.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { saveSearch, fetchHistory, deleteHistoryItem } from "../services/api";

function FuelCalculator() {
  const [distance, setDistance] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");
  const [fuelNeeded, setFuelNeeded] = useState(null);
  const [totalCost, setTotalCost] = useState(null);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadHistory() {
      const data = await fetchHistory();
      setHistory(data);
    }
    loadHistory();

    // Handle back button logout
    const handleBackButton = () => {
      signOut(auth)
        .then(() => {
          console.log("Logged out due to back navigation.");
          navigate("/auth");
        })
        .catch((error) => {
          console.error("Failed to log out:", error);
        });
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);

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

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/auth");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  return (
    <div className="mt-10 p-8 bg-gradient-to-r from-sky-100 to-blue-200 rounded-3xl shadow-2xl max-w-2xl mx-auto">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-indigo-700 drop-shadow-lg">
        🚗 Fuel Cost Calculator
      </h2>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-6 rounded-xl mb-6 hover:bg-red-600 transition"
      >
        Logout
      </button>
      <div className="space-y-6">
        <input
          type="number"
          placeholder="Enter Distance (km)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className="border-2 p-4 rounded-xl w-full shadow-md focus:ring-4 focus:ring-indigo-400 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Enter Mileage (km/l)"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
          className="border-2 p-4 rounded-xl w-full shadow-md focus:ring-4 focus:ring-indigo-400 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Fuel Price (₹/litre)"
          value={fuelPrice}
          onChange={(e) => setFuelPrice(e.target.value)}
          className="border-2 p-4 rounded-xl w-full shadow-md focus:ring-4 focus:ring-indigo-400 focus:outline-none"
        />
        <button
          onClick={handleCalculate}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl w-full hover:shadow-xl hover:scale-105 transition-transform duration-300"
        >
          Calculate
        </button>

        {totalCost && (
          <div className="mt-6 p-6 bg-indigo-100 rounded-2xl text-center shadow-md">
            <p className="text-xl font-bold text-indigo-700">
              Fuel Needed: {fuelNeeded} litres
            </p>
            <p className="text-xl font-bold text-indigo-700">
              Total Cost: ₹{totalCost}
            </p>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-3xl font-bold mb-4 text-gray-700">
            📜 Calculation History
          </h3>
          {history.length === 0 ? (
            <p className="text-gray-500 text-center">No history available.</p>
          ) : (
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="border-2 p-4 rounded-xl bg-white shadow-lg flex justify-between items-center"
                >
                  <div>
                    <p className="text-gray-700">
                      Distance: {item.distance} km | Mileage: {item.mileage}{" "}
                      km/l
                    </p>
                    <p className="text-gray-700">
                      Fuel: {item.fuelNeeded.toFixed(2)} l | Cost: ₹
                      {item.fuelCost.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-500 hover:text-red-700 transition-all font-bold"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FuelCalculator;
