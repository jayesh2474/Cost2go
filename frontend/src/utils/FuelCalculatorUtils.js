import React from "react";
import { FaCarAlt, FaTruck, FaBus, FaBicycle, FaCar } from "react-icons/fa";
import { MdDirectionsCar, MdTwoWheeler } from "react-icons/md";

// Vehicle icon selector
export const getVehicleIcon = (vehicle) => {
  switch (vehicle.icon) {
    case "sedan":
      return <MdDirectionsCar />;
    case "suv":
      return <FaCarAlt />;
    case "motorcycle":
      return <MdTwoWheeler />;
    case "truck":
      return <FaTruck />;
    case "bus":
      return <FaBus />;
    case "bicycle":
      return <FaBicycle />;
    case "other":
      // Display first letter of custom icon as fallback
      return vehicle.customIcon ? (
        <span className="text-xs font-bold">
          {vehicle.customIcon.charAt(0).toUpperCase()}
        </span>
      ) : (
        <FaCar />
      );
    default:
      return <FaCar />;
  }
};

// Calculate total expenses for analytics
export const calculateTotalExpenses = (trips) => {
  return trips
    .reduce((sum, trip) => sum + parseFloat(trip.totalCost), 0)
    .toFixed(2);
};

// Get expense data by vehicle
export const calculateExpensesByVehicle = (vehicles, trips) => {
  const data = {};
  vehicles.forEach((vehicle) => {
    data[vehicle.name] = 0;
  });

  trips.forEach((trip) => {
    if (data[trip.vehicle] !== undefined) {
      data[trip.vehicle] += parseFloat(trip.totalCost);
    }
  });

  return data;
};

// Helper function to calculate average trip distance
export const calculateAverageDistance = (trips) => {
  if (trips.length === 0) return 0;
  return (
    trips.reduce((sum, trip) => sum + trip.distance, 0) / trips.length
  ).toFixed(1);
};

// Helper function to calculate average fuel consumption
export const calculateAverageFuel = (trips) => {
  if (trips.length === 0) return 0;
  return (
    trips.reduce((sum, trip) => sum + parseFloat(trip.fuelNeeded), 0) /
    trips.length
  ).toFixed(1);
};

// Calculate percentage of total for a given cost
export const calculatePercentOfTotal = (cost, totalCost) => {
  return ((cost / totalCost) * 100).toFixed(1);
};

// Format currency for display
export const formatCurrency = (amount) => {
  return `$${parseFloat(amount).toFixed(2)}`;
};

// Format fuel amount for display
export const formatFuel = (amount) => {
  return `${parseFloat(amount).toFixed(2)} L`;
};
