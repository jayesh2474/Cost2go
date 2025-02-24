import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { FaEnvelope, FaLock, FaGasPump, FaCar } from "react-icons/fa";

function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Animation states
  const [animate, setAnimate] = useState(false);
  const [switchAnimation, setSwitchAnimation] = useState(false);

  useEffect(() => {
    setAnimate(true);

    // Background animation setup
    const canvas = document.getElementById("bg-canvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Resize handler
      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      window.addEventListener("resize", handleResize);

      // Particles for gas/fuel droplet animation
      const particles = [];
      const particleCount = 30;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 5 + 2,
          speedY: Math.random() * 1 + 0.5,
          color: `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(
            Math.random() * 100
          )}, ${Math.floor(Math.random() * 255)}, 0.7)`,
        });
      }

      // Animation loop
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle) => {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();

          // Move particle down (like fuel drops)
          particle.y += particle.speedY;

          // Reset particle when it goes off screen
          if (particle.y > canvas.height) {
            particle.y = 0;
            particle.x = Math.random() * canvas.width;
          }
        });

        requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const toggleSignupMode = () => {
    setSwitchAnimation(true);
    setTimeout(() => {
      setIsSignup(!isSignup);
      setSwitchAnimation(false);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("User registered successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("User logged in successfully!");
        navigate("/calculate", { replace: true });
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      alert("User logged in successfully!");
      navigate("/calculate", { replace: true });
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-100 to-blue-200 relative overflow-hidden px-4 py-8">
      {/* Canvas background for fuel drop animation */}
      <canvas id="bg-canvas" className="absolute top-0 left-0 w-full h-full" />

      {/* Car and pump decorative elements */}
      <div className="absolute top-8 left-8 text-indigo-600 opacity-30 hidden md:block">
        <FaCar className="text-6xl" />
      </div>
      <div className="absolute bottom-8 right-8 text-indigo-600 opacity-30 hidden md:block">
        <FaGasPump className="text-6xl" />
      </div>

      <div
        className={`bg-white bg-opacity-90 p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10 transform transition-all duration-500 ${
          animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        } ${switchAnimation ? "scale-95 opacity-70" : "scale-100 opacity-100"}`}
      >
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white mb-4">
            <FaGasPump className="text-2xl md:text-3xl" />
          </div>
          <h2 className="text-3xl font-extrabold text-indigo-700 drop-shadow-sm mb-2">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-600">
            {isSignup
              ? "Sign up to track your fuel expenses"
              : "Login to your fuel calculator"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-indigo-400">
              <FaEnvelope />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border-2 text-gray-700 rounded-xl shadow-md focus:ring-4 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-indigo-400">
              <FaLock />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border-2 text-gray-700 rounded-xl shadow-md focus:ring-4 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-indigo-500 to-purple-600 text-white ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Processing...
              </span>
            ) : isSignup ? (
              "Create Account"
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="my-6 flex items-center justify-center">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 bg-white rounded-xl shadow-md hover:shadow-lg transition-all text-gray-700"
          disabled={isLoading}
        >
          {/* Original Google logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="24px"
            height="24px"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="mt-8 text-center">
          <button
            onClick={toggleSignupMode}
            className="inline-block text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition-colors"
          >
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </button>
        </div>

        {/* Decorative fuel gauge element */}
        <div className="absolute -bottom-6 right-6 text-indigo-500 opacity-20 rotate-12 transform">
          <svg width="60" height="60" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
