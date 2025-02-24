import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { saveSearch, fetchHistory, deleteHistoryItem } from "../services/api";
import { motion } from "framer-motion";

function FuelCalculator() {
  const [distance, setDistance] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");
  const [fuelNeeded, setFuelNeeded] = useState(null);
  const [totalCost, setTotalCost] = useState(null);
  const [history, setHistory] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
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

    setIsCalculating(true);

    // Simulate calculation time for animation
    setTimeout(async () => {
      const fuel = distance / mileage;
      const cost = fuel * fuelPrice;
      setFuelNeeded(fuel.toFixed(2));
      setTotalCost(cost.toFixed(2));
      const newEntry = { distance, mileage, fuelNeeded: fuel, fuelCost: cost };
      await saveSearch(newEntry);
      setHistory((prev) => [...prev, newEntry]);
      setIsCalculating(false);
    }, 1200);
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
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex justify-between items-center">
            <motion.h2
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
              className="text-2xl md:text-3xl font-bold"
            >
              🚗 Fuel Calculator
            </motion.h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 md:px-4 text-sm rounded-lg transition-all"
            >
              Logout
            </motion.button>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-blue-100 text-sm"
          >
            Calculate fuel costs for your journey
          </motion.div>
        </div>

        {/* Calculator Form */}
        <div className="p-6">
          <div className="space-y-4">
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Enter distance"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <span className="absolute left-3 top-3 text-gray-400">🛣️</span>
                <span className="absolute right-3 top-3 text-gray-400 text-sm">
                  km
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mileage
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Enter mileage"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <span className="absolute left-3 top-3 text-gray-400">⛽</span>
                <span className="absolute right-3 top-3 text-gray-400 text-sm">
                  km/l
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fuel Price
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Enter fuel price"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <span className="absolute left-3 top-3 text-gray-400">₹</span>
                <span className="absolute right-3 top-3 text-gray-400 text-sm">
                  /litre
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCalculate}
                disabled={isCalculating}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex justify-center items-center"
              >
                {isCalculating ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Calculating...
                  </div>
                ) : (
                  "Calculate"
                )}
              </motion.button>
            </motion.div>
          </div>

          {/* Results */}
          {totalCost && !isCalculating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
            >
              <div className="flex justify-between">
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Fuel Required</div>
                  <div className="font-semibold text-lg text-blue-800">
                    {fuelNeeded} litres
                  </div>
                </div>
                <div className="w-px bg-blue-200"></div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Total Cost</div>
                  <div className="font-semibold text-lg text-blue-800">
                    ₹{totalCost}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* History Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-700">
                Recent Calculations
              </h3>
              <div className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <span className="text-sm">{history.length}</span>
              </div>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-100">
              {history.length === 0 ? (
                <div className="text-center py-4 text-gray-400 text-sm">
                  No calculations yet
                </div>
              ) : (
                history.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <span>🛣️ {item.distance} km</span>
                          <span>|</span>
                          <span>⛽ {item.mileage} km/l</span>
                        </div>
                        <div className="text-sm font-medium">
                          <span className="text-blue-700">
                            {item.fuelNeeded.toFixed(2)} litres
                          </span>
                          <span className="mx-1">•</span>
                          <span className="text-indigo-700">
                            ₹{item.fuelCost.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(index)}
                        className="text-gray-400 hover:text-red-500 transition-all"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-8 text-gray-500 text-xs"
      >
        © 2025 Fuel Calculator App
      </motion.div>
    </div>
  );
}

export default FuelCalculator;
