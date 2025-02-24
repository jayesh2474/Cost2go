import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGasPump, FaRoute, FaMoneyBillWave, FaCarSide } from 'react-icons/fa';

export default function LandingPage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const handleCalculateClick = () => {
    navigate('/auth');
  };

  // Canvas animation for moving vehicles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Vehicle class
    class Vehicle {
      constructor(x, y, speed, type) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.type = type; // 'car' or 'truck'
        this.width = type === 'car' ? 60 : 90;
        this.height = type === 'car' ? 30 : 40;
        this.color = type === 'car' 
          ? `hsl(${Math.random() * 60 + 200}, 70%, 50%)` // Blue shades for cars
          : `hsl(${Math.random() * 40 + 10}, 70%, 50%)`; // Red/orange for trucks
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        
        if (this.type === 'car') {
          // Car body
          ctx.roundRect(this.x, this.y, this.width, this.height, 8);
          ctx.fill();
          
          // Car windows
          ctx.fillStyle = 'rgba(200, 230, 255, 0.7)';
          ctx.fillRect(this.x + 15, this.y - 8, 25, 8);
          
          // Wheels
          ctx.fillStyle = '#333';
          ctx.beginPath();
          ctx.arc(this.x + 15, this.y + this.height, 6, 0, Math.PI * 2);
          ctx.arc(this.x + this.width - 15, this.y + this.height, 6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Truck body
          ctx.roundRect(this.x, this.y, this.width * 0.7, this.height, 5);
          ctx.roundRect(this.x + this.width * 0.7, this.y + 5, this.width * 0.3, this.height - 5, 3);
          ctx.fill();
          
          // Truck windows
          ctx.fillStyle = 'rgba(200, 230, 255, 0.7)';
          ctx.fillRect(this.x + 10, this.y - 8, 20, 8);
          
          // Wheels
          ctx.fillStyle = '#333';
          ctx.beginPath();
          ctx.arc(this.x + 20, this.y + this.height, 8, 0, Math.PI * 2);
          ctx.arc(this.x + 50, this.y + this.height, 8, 0, Math.PI * 2);
          ctx.arc(this.x + 70, this.y + this.height, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      update() {
        this.x -= this.speed;
        if (this.x < -this.width) {
          this.x = canvas.width + Math.random() * 300;
          this.y = Math.random() * (canvas.height - 200) + 100;
        }
        this.draw();
      }
    }

    // Gas bubble class
    class GasBubble {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 20;
        this.size = Math.random() * 6 + 2;
        this.speedY = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.7 + 0.3;
        this.hue = Math.random() * 60 + 200; // Blue to purple shades
      }

      draw() {
        ctx.fillStyle = `hsla(${this.hue}, 70%, 50%, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      update() {
        this.y -= this.speedY;
        this.opacity -= 0.003;
        
        if (this.y < 0 || this.opacity < 0) {
          this.x = Math.random() * canvas.width;
          this.y = canvas.height + Math.random() * 20;
          this.opacity = Math.random() * 0.7 + 0.3;
        }
        
        this.draw();
      }
    }

    // Create vehicles and bubbles
    const vehicles = [];
    const gasBubbles = [];
    
    const vehicleCount = Math.min(5, Math.floor(canvas.width / 300));
    for (let i = 0; i < vehicleCount; i++) {
      const type = Math.random() > 0.7 ? 'truck' : 'car';
      vehicles.push(new Vehicle(
        canvas.width + Math.random() * 500,
        Math.random() * (canvas.height - 200) + 100,
        Math.random() * 2 + 1,
        type
      ));
    }
    
    for (let i = 0; i < 30; i++) {
      gasBubbles.push(new GasBubble());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw a subtle road
      ctx.fillStyle = 'rgba(100, 100, 100, 0.2)';
      for (let i = 0; i < Math.ceil(canvas.width / 200); i++) {
        const x = i * 200 - (Date.now() / 100) % 200;
        ctx.fillRect(x, canvas.height / 2 + 60, 100, 10);
      }
      
      vehicles.forEach(vehicle => vehicle.update());
      gasBubbles.forEach(bubble => bubble.update());
      
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-sky-100 to-blue-200 flex flex-col items-center justify-center p-6">
      {/* Background canvas for animations */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full z-0"
      />
      
      <div className="relative z-10 max-w-7xl w-full mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-indigo-700 drop-shadow-sm">
              Fuel Cost <span className="text-purple-600">Calculator</span>
            </h1>
            
            <p className="text-lg text-gray-700 mb-8 max-w-xl">
              Plan your journey smarter with our premium fuel calculator. 
              Track expenses, estimate costs, and optimize your travel budget in seconds.
            </p>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <button
                onClick={handleCalculateClick}
                className="px-8 py-4 rounded-xl font-bold text-lg shadow-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white 
                  transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                Start Calculating Now
              </button>
            </motion.div>
            
            {/* Features */}
            <div className="mt-12 grid grid-cols-2 gap-4">
              {[
                { icon: <FaGasPump />, text: "Precise Fuel Tracking" },
                { icon: <FaRoute />, text: "Route Cost Planning" },
                { icon: <FaMoneyBillWave />, text: "Budget Optimization" },
                { icon: <FaCarSide />, text: "Vehicle Efficiency" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="flex items-center bg-white bg-opacity-80 p-3 rounded-lg shadow-md"
                >
                  <div className="text-indigo-600 text-xl mr-3">
                    {feature.icon}
                  </div>
                  <p className="font-medium text-gray-700">{feature.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Right content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl"
          >
            <div className="border-b border-gray-200 pb-4 mb-6">
              <div className="inline-block p-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white mb-4">
                <FaGasPump className="text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-indigo-700">Why Our Calculator?</h2>
            </div>
            
            <ul className="space-y-4 mb-8">
              {[
                "Real-time fuel price updates",
                "Multiple vehicle profile support",
                "Detailed expense analytics",
                "Trip history with cost breakdown",
                "Eco-friendly route suggestions"
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  className="flex items-start"
                >
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">{item}</span>
                </motion.li>
              ))}
            </ul>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="bg-indigo-50 p-4 rounded-xl border border-indigo-100"
            >
              <p className="text-indigo-700 font-medium text-center">
                "Join thousands of drivers who save up to 20% on fuel costs every month!"
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 text-indigo-600 opacity-20 hidden md:block">
        <FaCarSide className="text-8xl" />
      </div>
      
      <div className="absolute bottom-10 left-10 text-indigo-600 opacity-20 hidden md:block">
        <FaGasPump className="text-8xl" />
      </div>
      
      {/* Footer */}
      <div className="mt-16 text-center relative z-10">
        <p className="text-gray-600">© 2025 Fuel Calculator by Jayesh Joshi</p>
      </div>
    </div>
  );
}