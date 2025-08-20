// components/Navbar.jsx - UPDATED with Enhanced Logos
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";
import { BrandLogo, MinimalLogo } from "./Logo";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

const Navbar = () => {
  const { isDark, toggleDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" }
  ];

  const isActiveLink = (path) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 backdrop-blur-xl border-b ${
        isDark 
          ? "bg-gray-900/80 border-white/10 text-white" 
          : "bg-white/80 border-gray-200/30 text-gray-900"
      } shadow-lg`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* ✨ Enhanced Logo Section */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center group cursor-pointer"
          >
            <Link to="/" className="flex items-center">
              {/* Desktop: Full Brand Logo */}
              <div className="hidden sm:block">
                <BrandLogo isDark={isDark} variant="compact" />
              </div>
              
              {/* Mobile: Minimal Logo Only */}
              <div className="sm:hidden flex items-center space-x-2">
                <MinimalLogo size={36} isDark={isDark} />
                <span className={`text-lg font-black ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  Pass<span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Guard</span>
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={link.path}
                  className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActiveLink(link.path)
                      ? isDark
                        ? "bg-indigo-500/20 text-indigo-300 shadow-lg"
                        : "bg-indigo-500/20 text-indigo-600 shadow-lg"
                      : isDark
                        ? "text-gray-300 hover:text-white hover:bg-white/10"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"
                  }`}
                >
                  {link.name}
                  {isActiveLink(link.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Section - Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            
            {/* 🌙 Enhanced Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className={`p-3 rounded-xl backdrop-blur-sm transition-all duration-300 shadow-lg ${
                isDark 
                  ? "bg-white/10 hover:bg-white/20 text-yellow-400 hover:shadow-yellow-400/20" 
                  : "bg-gray-100/60 hover:bg-gray-200/60 text-gray-600 hover:shadow-gray-400/20"
              } hover:shadow-lg`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                  >
                    <Sun size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 180, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -180, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                  >
                    <Moon size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Enhanced Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-3 rounded-xl backdrop-blur-sm transition-all duration-300 shadow-lg ${
                isDark 
                  ? "bg-white/10 hover:bg-white/20 text-white" 
                  : "bg-gray-100/60 hover:bg-gray-200/60 text-gray-600"
              }`}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden border-t backdrop-blur-xl ${
              isDark 
                ? "bg-gray-900/95 border-white/10" 
                : "bg-white/95 border-gray-200/30"
            }`}
          >
            <div className="px-4 py-6 space-y-3">
              {/* Mobile Logo */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center pb-4 border-b border-white/10"
              >
                <BrandLogo isDark={isDark} variant="compact" />
              </motion.div>
              
              {/* Mobile Navigation Links */}
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                      isActiveLink(link.path)
                        ? isDark
                          ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 shadow-lg border border-indigo-500/30"
                          : "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-600 shadow-lg border border-indigo-500/30"
                        : isDark
                          ? "text-gray-300 hover:text-white hover:bg-white/10"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              {/* Mobile Theme Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-4 border-t border-white/10"
              >
                <button
                  onClick={() => {
                    toggleDarkMode();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    isDark
                      ? "bg-white/10 text-yellow-400 hover:bg-white/20"
                      : "bg-gray-100/60 text-gray-600 hover:bg-gray-200/60"
                  }`}
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                  <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
