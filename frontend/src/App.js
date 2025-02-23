import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FuelCalculator from "./components/FuelCalculator";
import LandingPage from "./pages/LandingPage";

import "leaflet/dist/leaflet.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/calculate" element={<FuelCalculator />} />
      </Routes>
    </Router>
  );
}

export default App;
