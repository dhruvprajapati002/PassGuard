// components/Logo.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield } from 'lucide-react';

// 🚀 Enhanced Animated PassGuard Logo
export const PassGuardLogo = ({ size = 48, isDark = false }) => {
  const gradientId = `passguard-gradient-${isDark ? 'dark' : 'light'}-${Math.random().toString(36).substr(2, 9)}`;
  const glowId = `passguard-glow-${isDark ? 'dark' : 'light'}-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <defs>
        {/* Enhanced Gradient */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isDark ? "#6366f1" : "#4f46e5"} />
          <stop offset="50%" stopColor={isDark ? "#8b5cf6" : "#7c3aed"} />
          <stop offset="100%" stopColor={isDark ? "#c084fc" : "#a855f7"} />
        </linearGradient>
        
        {/* Glow Filter */}
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Shimmer Effect */}
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="100%" stopColor="transparent" />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="-100 0;100 0;-100 0"
            dur="3s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>

      {/* Outer Shield Glow */}
      <motion.path
        d="M50 5 L15 20 L15 45 Q15 70 50 90 Q85 70 85 45 L85 20 Z"
        fill={`url(#${gradientId})`}
        filter={`url(#${glowId})`}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      
      {/* Inner Shield */}
      <motion.path
        d="M50 15 L25 25 L25 45 Q25 65 50 80 Q75 65 75 45 L75 25 Z"
        fill="rgba(255,255,255,0.15)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
      
      {/* Key Circle */}
      <motion.circle
        cx="45"
        cy="45"
        r="8"
        fill="white"
        filter={`url(#${glowId})`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      />
      
      {/* Key Body */}
      <motion.rect
        x="50"
        y="41"
        width="16"
        height="4"
        rx="2"
        fill="white"
        filter={`url(#${glowId})`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      />
      
      {/* Key Teeth */}
      <motion.rect
        x="62"
        y="37"
        width="4"
        height="4"
        fill="white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.3 }}
      />
      <motion.rect
        x="62"
        y="45"
        width="4"
        height="4"
        fill="white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.3 }}
      />
      
      {/* Shimmer Overlay */}
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        fill="url(#shimmer)"
        opacity="0.7"
      />
    </motion.svg>
  );
};

// 🎨 Stylish Text Logo with Animation
export const TextLogo = ({ isDark = false, showIcon = true, animated = true }) => {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex items-center space-x-3">
      {showIcon && (
        <motion.div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
            isDark 
              ? "bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500" 
              : "bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600"
          }`}
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        >
          <Lock className="w-5 h-5 text-white" />
        </motion.div>
      )}
      
      <motion.div
        variants={animated ? textVariants : undefined}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
        className="relative"
      >
        <motion.h1
          className={`text-3xl font-black tracking-tight ${
            isDark ? "text-white" : "text-gray-900"
          }`}
          whileHover={animated ? { scale: 1.02 } : undefined}
        >
          {animated ? (
            <>
              {"Pass".split("").map((letter, index) => (
                <motion.span key={index} variants={letterVariants}>
                  {letter}
                </motion.span>
              ))}
              <span className="relative">
                <span className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {"Guard".split("").map((letter, index) => (
                    <motion.span key={index} variants={letterVariants}>
                      {letter}
                    </motion.span>
                  ))}
                </span>
                {/* Underline Animation */}
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                />
              </span>
            </>
          ) : (
            <>
              Pass
              <span className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Guard
              </span>
            </>
          )}
        </motion.h1>
        
        {/* Tagline */}
        <motion.p
          className={`text-xs font-medium mt-1 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
          initial={animated ? { opacity: 0 } : undefined}
          animate={animated ? { opacity: 1 } : undefined}
          transition={animated ? { delay: 2, duration: 0.5 } : undefined}
        >
          Secure • Simple • Smart
        </motion.p>
      </motion.div>
    </div>
  );
};

// 🔥 Futuristic Neon Logo
export const NeonLogo = ({ size = 120, isDark = false }) => {
  const neonId = `neon-${isDark ? 'dark' : 'light'}-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <motion.svg
      width={size}
      height={size * 0.4}
      viewBox="0 0 300 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <defs>
        <filter id={neonId} x="-50%" y="-50%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f5ff" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#f72585" />
        </linearGradient>
      </defs>
      
      {/* Neon Text */}
      <motion.text
        x="50"
        y="70"
        fontFamily="Arial Black, sans-serif"
        fontSize="48"
        fontWeight="900"
        fill="url(#neonGrad)"
        stroke="url(#neonGrad)"
        strokeWidth="1"
        filter={`url(#${neonId})`}
        initial={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 3, ease: "easeInOut" }}
      >
        PASSGUARD
      </motion.text>
      
      {/* Pulsing Glow */}
      <motion.rect
        x="40"
        y="30"
        width="220"
        height="60"
        fill="none"
        stroke="url(#neonGrad)"
        strokeWidth="2"
        rx="15"
        filter={`url(#${neonId})`}
        animate={{ 
          strokeOpacity: [0.3, 1, 0.3],
          strokeWidth: [2, 4, 2] 
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut" 
        }}
      />
    </motion.svg>
  );
};

// ✨ Minimal Floating Logo
export const MinimalLogo = ({ size = 40, isDark = false }) => {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl shadow-lg ${
        isDark 
          ? "bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500" 
          : "bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600"
      }`}
      style={{ width: size, height: size }}
      whileHover={{ 
        scale: 1.1, 
        rotate: 5,
        boxShadow: isDark 
          ? "0 20px 40px rgba(139, 92, 246, 0.3)" 
          : "0 20px 40px rgba(124, 58, 237, 0.3)"
      }}
      whileTap={{ scale: 0.95 }}
      animate={{ 
        y: [0, -5, 0],
        boxShadow: [
          isDark 
            ? "0 5px 15px rgba(139, 92, 246, 0.2)" 
            : "0 5px 15px rgba(124, 58, 237, 0.2)",
          isDark 
            ? "0 10px 30px rgba(139, 92, 246, 0.4)" 
            : "0 10px 30px rgba(124, 58, 237, 0.4)",
          isDark 
            ? "0 5px 15px rgba(139, 92, 246, 0.2)" 
            : "0 5px 15px rgba(124, 58, 237, 0.2)"
        ]
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 3,
        ease: "easeInOut" 
      }}
    >
      {/* Inner Glow */}
      <div className="absolute inset-2 border-2 border-white/60 rounded-xl backdrop-blur-sm">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div 
            className="w-3 h-3 bg-white rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <motion.div 
            className="w-6 h-1.5 bg-white rounded-full mt-1"
            animate={{ scaleX: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
          />
        </div>
      </div>
      
      {/* Sparkle Effect */}
      <motion.div
        className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full"
        animate={{ 
          opacity: [0, 1, 0],
          scale: [0, 1, 0] 
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          delay: 1 
        }}
      />
    </motion.div>
  );
};

// 🌟 Combined Logo with Brand Name
export const BrandLogo = ({ isDark = false, variant = "default" }) => {
  const variants = {
    default: { size: 48, showTagline: true },
    compact: { size: 32, showTagline: false },
    large: { size: 64, showTagline: true }
  };
  
  const config = variants[variant];
  
  return (
    <div className="flex items-center space-x-4">
      <PassGuardLogo size={config.size} isDark={isDark} />
      <div>
        <motion.h1
          className={`font-black tracking-tight ${
            variant === 'large' ? 'text-4xl' : variant === 'compact' ? 'text-xl' : 'text-2xl'
          } ${isDark ? "text-white" : "text-gray-900"}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Pass<span className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 bg-clip-text text-transparent">Guard</span>
        </motion.h1>
        {config.showTagline && (
          <motion.p
            className={`text-sm font-medium ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            Your Digital Fortress 🛡️
          </motion.p>
        )}
      </div>
    </div>
  );
};

