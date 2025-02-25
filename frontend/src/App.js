import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FuelCalculator from "./components/FuelCalculator";
import LandingPage from "./pages/LandingPage";
import AuthForm from "./components/AuthForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Dash from "./pages/FuelCalculator";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/dash" element={<Dash />} />
        <Route
          path="/calculate"
          element={
            <ProtectedRoute>
              <FuelCalculator />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
