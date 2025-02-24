import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleCalculateClick = () => {
    navigate('/auth'); // Redirect to calculation page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Fuel Cost Calculator</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Easily calculate your travel costs by entering the distance, fuel price, and your vehicle's mileage. Instantly find out the total cost of your trip and how much fuel you'll burn in liters.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <Card className="max-w-md w-full shadow-2xl rounded-2xl p-6 bg-white">
          <CardContent>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Why Use This Calculator?</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Quick and easy fuel cost estimation</li>
              <li>Accurate fuel consumption details</li>
              <li>Helps you budget your trips better</li>
            </ul>
            <Button
              onClick={handleCalculateClick}
              className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl shadow-lg"
            >
              Calculate Now
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
