import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchFuelPrice, saveSearch } from "../services/api";
import L from "leaflet";

function LocationMarker({ setCoords, label }) {
  useMapEvents({
    click(e) {
      setCoords(e.latlng);
    },
  });

  return null;
}

function FuelCalculator() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [distance, setDistance] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuelPrice, setFuelPrice] = useState(100); // Default price while API is implemented
  const [totalCost, setTotalCost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getPrice() {
      try {
        const price = await fetchFuelPrice();
        setFuelPrice(price);
      } catch (err) {
        console.error("Error fetching fuel price:", err);
      }
    }
    getPrice();
  }, []);

  useEffect(() => {
    if (currentLocation && destinationCoords) {
      const dist = calculateDistance(currentLocation, destinationCoords);
      setDistance(dist.toFixed(2));
    }
  }, [currentLocation, destinationCoords]);

  const calculateDistance = (loc1, loc2) => {
    const from = L.latLng(loc1.lat, loc1.lng);
    const to = L.latLng(loc2.lat, loc2.lng);
    return from.distanceTo(to) / 1000; // Convert meters to kilometers
  };

  const handleCalculate = async () => {
    setError("");
    if (!distance || !mileage) {
      setError("Please enter all required fields");
      return;
    }
    if (mileage <= 0) {
      setError("Mileage must be greater than 0");
      return;
    }

    const fuelNeeded = distance / mileage;
    const cost = fuelNeeded * fuelPrice;
    setTotalCost(cost.toFixed(2));

    try {
      await saveSearch({
        destination: destinationCoords
          ? `${destinationCoords.lat.toFixed(
              4
            )}, ${destinationCoords.lng.toFixed(4)}`
          : "",
        distance,
        mileage,
        fuelCost: cost,
      });
    } catch (err) {
      console.error("Error saving search:", err);
    }
  };

  const handleReset = () => {
    setDestinationCoords(null);
    setDistance("");
    setMileage("");
    setTotalCost(null);
    setError("");
  };

  return (
    <div className="mt-5 p-4 bg-white rounded-xl shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        Fuel Cost Calculator
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ height: "400px", width: "100%", borderRadius: "12px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {currentLocation && (
              <Marker position={currentLocation}>
                <Popup>Current Location</Popup>
              </Marker>
            )}
            {destinationCoords && (
              <Marker position={destinationCoords}>
                <Popup>Destination</Popup>
              </Marker>
            )}
            {currentLocation && destinationCoords && (
              <Polyline
                positions={[
                  [currentLocation.lat, currentLocation.lng],
                  [destinationCoords.lat, destinationCoords.lng],
                ]}
                color="blue"
              />
            )}
            <LocationMarker
              setCoords={setCurrentLocation}
              label="Current Location"
            />
            <LocationMarker
              setCoords={setDestinationCoords}
              label="Destination"
            />
          </MapContainer>
          <p className="text-sm text-gray-600 mt-2">
            Click on the map to set locations
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Location
              </label>
              <input
                type="text"
                placeholder="Selected Current Location"
                value={
                  currentLocation
                    ? `${currentLocation.lat.toFixed(
                        4
                      )}, ${currentLocation.lng.toFixed(4)}`
                    : ""
                }
                readOnly
                className="border p-2 rounded w-full bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <input
                type="text"
                placeholder="Selected Destination"
                value={
                  destinationCoords
                    ? `${destinationCoords.lat.toFixed(
                        4
                      )}, ${destinationCoords.lng.toFixed(4)}`
                    : ""
                }
                readOnly
                className="border p-2 rounded w-full bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance (km)
              </label>
              <input
                type="number"
                placeholder="Distance"
                value={distance}
                readOnly
                className="border p-2 rounded w-full bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Mileage (km/l)
              </label>
              <input
                type="number"
                placeholder="Enter Mileage (km/l)"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className="border p-2 rounded w-full"
                min="0"
                step="0.1"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCalculate}
                disabled={!distance || !mileage}
                className={`flex-1 py-2 px-4 rounded text-white transition-colors
                  ${
                    !distance || !mileage
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                Calculate Cost
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2 px-4 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
              >
                Reset
              </button>
            </div>

            {totalCost && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700">
                  Estimated Fuel Cost
                </h3>
                <div className="text-3xl font-bold text-blue-600 mt-1">
                  ₹{totalCost}
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  Based on fuel price: ₹{fuelPrice}/liter
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FuelCalculator;
