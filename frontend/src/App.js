import React from "react";
import FuelCalculator from "./components/FuelCalculator";
import History from "./components/History";

function App() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center">Fuel Cost Calculator</h1>
      <FuelCalculator />
      <History />
    </div>
  );
}

export default App;
