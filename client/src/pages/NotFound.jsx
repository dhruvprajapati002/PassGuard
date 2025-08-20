// pages/NotFound.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, AlertTriangle } from "lucide-react";
import { PassGuardLogo } from "../components/Logo";

const NotFound = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  // Theme detection
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsDark(storedTheme === "dark");
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden ${
      isDark
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        : "bg-gradient-to-br from-indigo-50 via-purple-100 to-pink-100"
    }`}>
      
      <div className="flex flex-1 justify-center items-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl text-center"
        >
          
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className={`p-4 rounded-2xl backdrop-blur-sm ${
              isDark ? "bg-white/10" : "bg-white/20"
            } shadow-lg`}>
              <PassGuardLogo size={48} isDark={isDark} />
            </div>
          </div>

          {/* 404 Content */}
          <div className={`backdrop-blur-xl rounded-3xl p-12 border shadow-2xl ${
            isDark
              ? "bg-white/5 border-white/10"
              : "bg-white/20 border-white/30"
          }`}>
            <div className={`inline-flex p-6 rounded-full mb-6 ${
              isDark ? "bg-red-500/20" : "bg-red-100"
            }`}>
              <AlertTriangle size={64} className="text-red-500" />
            </div>

            <h1 className={`text-6xl font-black mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              404
            </h1>
            
            <h2 className={`text-2xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Page Not Found
            </h2>
            
            <p className={`text-lg mb-8 max-w-md mx-auto ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
              The page you're looking for doesn't exist or has been moved. 
              Don't worry, your passwords are still safe with PassGuard!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Home size={18} />
                <span>Go Home</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className={`flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                  isDark 
                    ? "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                    : "bg-white/20 text-gray-700 border border-white/30 hover:bg-white/30"
                }`}
              >
                <ArrowLeft size={18} />
                <span>Go Back</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
