import React, { useEffect, useState } from "react";
import { fetchHistory } from "../services/api";

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function getHistory() {
      const data = await fetchHistory();
      setHistory(data);
    }
    getHistory();
  }, []);

  return (
    <div className="mt-5 p-4 border rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Search History</h2>
      {history.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <ul>
          {history.map((item) => (
            <li key={item._id} className="border-b py-2">
              {item.destination} - ₹{item.fuelCost.toFixed(2)} (Distance:{" "}
              {item.distance} km, Mileage: {item.mileage} km/l)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default History;
