import React, { useState } from "react";
import {
  FaGasPump,
  FaRoad,
  FaHistory,
  FaPlus,
  FaTrash,
  FaSignOutAlt,
  FaChartBar,
} from "react-icons/fa";
import { MdCurrencyRupee, MdLocalGasStation, MdSpeed } from "react-icons/md";
import {
  getVehicleIcon,
  calculateTotalExpenses,
  calculateExpensesByVehicle,
} from "../utils/FuelCalculatorUtils";

const FuelCalculator = () => {
  // State management
  const [activeVehicle, setActiveVehicle] = useState(0);
  const [vehicles, setVehicles] = useState([
    { name: "My Car", mileage: 12, icon: "sedan", customIcon: "" },
    { name: "SUV", mileage: 8, icon: "suv", customIcon: "" },
  ]);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    mileage: "",
    icon: "sedan",
    customIcon: "",
  });
  const [distance, setDistance] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");
  const [activeTab, setActiveTab] = useState("calculator");
  const [trips, setTrips] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Calculate fuel needed and cost
  const calculateFuel = () => {
    if (!distance || !fuelPrice || !vehicles[activeVehicle].mileage) return;

    const fuelNeeded = distance / vehicles[activeVehicle].mileage;
    const totalCost = fuelNeeded * fuelPrice;

    const newTrip = {
      id: Date.now(),
      vehicle: vehicles[activeVehicle].name,
      distance: parseFloat(distance),
      fuelPrice: parseFloat(fuelPrice),
      fuelNeeded: fuelNeeded.toFixed(2),
      totalCost: totalCost.toFixed(2),
      date: new Date().toLocaleDateString(),
    };

    setTrips([newTrip, ...trips]);
    setShowModal(true);

    // Clear inputs after calculation
    setTimeout(() => {
      setShowModal(false);
    }, 5000);
  };

  // Add new vehicle
  const handleAddVehicle = () => {
    if (newVehicle.name && newVehicle.mileage) {
      setVehicles([
        ...vehicles,
        {
          name: newVehicle.name,
          mileage: parseFloat(newVehicle.mileage),
          icon: newVehicle.icon,
          customIcon: newVehicle.customIcon,
        },
      ]);
      setNewVehicle({ name: "", mileage: "", icon: "sedan", customIcon: "" });
      setShowAddVehicle(false);
    }
  };

  // Delete trip from history
  const deleteTrip = (id) => {
    setTrips(trips.filter((trip) => trip.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 py-6 px-4 sm:px-6">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5 text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center">
              <FaGasPump className="mr-2" /> Fuel Cost Calculator
            </h1>
            <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg flex items-center text-sm">
              <FaSignOutAlt className="mr-1" /> Logout
            </button>
          </div>
          <p className="mt-1 text-blue-100 text-sm">
            Manage vehicle expenses efficiently
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap mt-3 gap-2">
            <span className="text-xs bg-blue-700 bg-opacity-30 px-2 py-1 rounded-full flex items-center">
              <FaGasPump className="mr-1" /> Multiple vehicles
            </span>
            <span className="text-xs bg-blue-700 bg-opacity-30 px-2 py-1 rounded-full flex items-center">
              <FaChartBar className="mr-1" /> Expense analytics
            </span>
            <span className="text-xs bg-blue-700 bg-opacity-30 px-2 py-1 rounded-full flex items-center">
              <FaHistory className="mr-1" /> Trip history
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 font-medium text-sm flex justify-center items-center ${
              activeTab === "calculator"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("calculator")}
          >
            <FaGasPump className="mr-1" /> Calculator
          </button>
          <button
            className={`flex-1 py-3 font-medium text-sm flex justify-center items-center ${
              activeTab === "history"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("history")}
          >
            <FaHistory className="mr-1" /> History
          </button>
          <button
            className={`flex-1 py-3 font-medium text-sm flex justify-center items-center ${
              activeTab === "analytics"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            <FaChartBar className="mr-1" /> Analytics
          </button>
        </div>

        {/* Calculator Tab */}
        {activeTab === "calculator" && (
          <div className="p-5">
            {/* Vehicle selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Vehicle
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {vehicles.map((vehicle, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveVehicle(index)}
                    className={`flex-shrink-0 flex flex-col items-center py-2 px-3 rounded-lg border transition-all ${
                      activeVehicle === index
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-xl mb-1">
                      {getVehicleIcon(vehicle)}
                    </span>
                    <span className="text-xs font-medium">{vehicle.name}</span>
                    <span className="text-xs text-gray-500">
                      {vehicle.mileage} km/l
                    </span>
                  </button>
                ))}

                <button
                  onClick={() => setShowAddVehicle(true)}
                  className="flex-shrink-0 flex flex-col items-center py-2 px-3 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:bg-gray-50 transition-all"
                >
                  <span className="text-xl mb-1">
                    <FaPlus />
                  </span>
                  <span className="text-xs">Add New</span>
                </button>
              </div>
            </div>

            {/* Add vehicle form */}
            {showAddVehicle && (
              <div className="mb-5 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="text-sm font-medium text-blue-800 mb-3">
                  Add New Vehicle
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">
                      Vehicle Name
                    </label>
                    <input
                      type="text"
                      value={newVehicle.name}
                      onChange={(e) =>
                        setNewVehicle({ ...newVehicle, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="My Vehicle"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">
                      Mileage (km/l)
                    </label>
                    <input
                      type="number"
                      value={newVehicle.mileage}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          mileage: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="12"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">
                      Vehicle Type
                    </label>
                    <select
                      value={newVehicle.icon}
                      onChange={(e) =>
                        setNewVehicle({ ...newVehicle, icon: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="motorcycle">Motorcycle</option>
                      <option value="truck">Truck</option>
                      <option value="bus">Bus</option>
                      <option value="bicycle">Bicycle</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Show custom vehicle type field when "other" is selected */}
                  {newVehicle.icon === "other" && (
                    <div>
                      <label className="block text-xs text-gray-700 mb-1">
                        Custom Vehicle Type
                      </label>
                      <input
                        type="text"
                        value={newVehicle.customIcon}
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            customIcon: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="e.g. Tractor, RV, Boat"
                      />
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleAddVehicle}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
                    >
                      Add Vehicle
                    </button>
                    <button
                      onClick={() => setShowAddVehicle(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Trip details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaRoad />
                  </span>
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="pl-10 pr-16 py-3 w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter distance"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    kilometers
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <MdCurrencyRupee />
                  </span>
                  <input
                    type="number"
                    value={fuelPrice}
                    onChange={(e) => setFuelPrice(e.target.value)}
                    className="pl-10 pr-16 py-3 w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter fuel price"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    per liter
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={calculateFuel}
                  disabled={!distance || !fuelPrice}
                  className={`w-full py-3 rounded-xl font-medium shadow-md flex justify-center items-center transition-all ${
                    !distance || !fuelPrice
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-lg"
                  }`}
                >
                  Calculate Fuel Cost
                </button>
              </div>
            </div>
            {/* Result modal */}
            {showModal && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                <h3 className="font-medium text-blue-800 mb-3 flex items-center">
                  <MdLocalGasStation className="mr-2" /> Calculation Results
                </h3>
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Fuel Required</div>
                    <div className="font-semibold text-lg text-blue-800">
                      {trips[0].fuelNeeded} liters
                    </div>
                  </div>
                  <div className="w-px bg-blue-200"></div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Total Cost</div>
                    <div className="font-semibold text-lg text-blue-800">
                      ₹{trips[0].totalCost}
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-100">
                  <div className="text-xs text-gray-500">
                    Vehicle: {trips[0].vehicle} • {trips[0].date}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Trip History
            </h2>

            {trips.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <FaHistory className="mx-auto text-4xl mb-3 opacity-30" />
                <p>No trip history yet</p>
                <p className="text-sm mt-1">
                  Your calculations will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {trips.map((trip) => (
                  <div
                    key={trip.id}
                    className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all bg-white"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-blue-100 text-blue-700 p-1 rounded">
                            {getVehicleIcon(
                              vehicles.find((v) => v.name === trip.vehicle) || {
                                icon: "sedan",
                              }
                            )}
                          </span>
                          <span className="font-medium text-gray-800">
                            {trip.vehicle}
                          </span>
                          <span className="text-xs text-gray-500">
                            {trip.date}
                          </span>
                        </div>

                        <div className="flex gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaRoad className="text-gray-400 mr-1" />
                            <span>{trip.distance} km</span>
                          </div>
                          <div className="flex items-center">
                            <MdLocalGasStation className="text-gray-400 mr-1" />
                            <span>{trip.fuelNeeded} L</span>
                          </div>
                          <div className="flex items-center">
                            <MdCurrencyRupee className="text-gray-400 mr-1" />
                            <span>₹{trip.totalCost}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteTrip(trip.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                      <div>Fuel price: ₹{trip.fuelPrice}/L</div>
                      <div className="flex items-center">
                        <MdSpeed className="mr-1" />
                        {vehicles.find((v) => v.name === trip.vehicle)
                          ?.mileage || 0}{" "}
                        km/L
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Expense Analytics
            </h2>

            {trips.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <FaChartBar className="mx-auto text-4xl mb-3 opacity-30" />
                <p>No data for analysis</p>
                <p className="text-sm mt-1">Make some calculations first</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                  <h3 className="text-sm font-medium text-indigo-800 mb-3">
                    Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">
                        Total Trips
                      </div>
                      <div className="text-xl font-bold text-indigo-700">
                        {trips.length}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">
                        Total Expenses
                      </div>
                      <div className="text-xl font-bold text-indigo-700">
                        ₹{calculateTotalExpenses(trips)}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">
                        Avg. Distance
                      </div>
                      <div className="text-xl font-bold text-indigo-700">
                        {(
                          trips.reduce((sum, trip) => sum + trip.distance, 0) /
                          trips.length
                        ).toFixed(1)}{" "}
                        km
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">
                        Avg. Fuel
                      </div>
                      <div className="text-xl font-bold text-indigo-700">
                        {(
                          trips.reduce(
                            (sum, trip) => sum + parseFloat(trip.fuelNeeded),
                            0
                          ) / trips.length
                        ).toFixed(1)}{" "}
                        L
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Expenses by Vehicle
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(
                      calculateExpensesByVehicle(vehicles, trips)
                    ).map(([vehicle, cost]) => (
                      <div
                        key={vehicle}
                        className="bg-white border border-gray-100 rounded-lg p-3"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span className="bg-blue-100 text-blue-700 p-1 rounded mr-2">
                              {getVehicleIcon(
                                vehicles.find((v) => v.name === vehicle) || {
                                  icon: "sedan",
                                }
                              )}
                            </span>
                            <span className="font-medium">{vehicle}</span>
                          </div>
                          <div className="text-blue-700 font-medium">
                            ₹{cost.toFixed(2)}
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                            style={{
                              width: `₹{
                                (cost / calculateTotalExpenses(trips)) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 text-right">
                          {(
                            (cost / calculateTotalExpenses(trips)) *
                            100
                          ).toFixed(1)}
                          % of total
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-center mt-6 text-gray-500 text-xs">
        © 2025 Fuel Cost Calculator App
      </div>
    </div>
  );
};

export default FuelCalculator;
