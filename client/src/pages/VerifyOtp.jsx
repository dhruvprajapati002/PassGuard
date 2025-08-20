// pages/VerifyOtp.jsx - Cleaned with Global Theme + Modern Toast
import React, { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Mail, 
  CheckCircle, 
  RefreshCcw,
  ArrowRight,
  Sparkles,
  Timer,
  Lock,
  AlertCircle,
  Info,
  MailCheck
} from "lucide-react";
import { PassGuardLogo } from "../components/Logo";
import { useTheme } from "../contexts/ThemeContext";

const api = import.meta.env.VITE_API_URL;

// Custom Toast Components for Better Styling
const CustomToast = ({ type, message, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9, y: -20 }}
    className={`flex items-center space-x-3 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border max-w-sm ${
      type === 'success' 
        ? 'bg-green-500/90 border-green-400/30 text-white' 
        : type === 'error'
        ? 'bg-red-500/90 border-red-400/30 text-white'
        : 'bg-blue-500/90 border-blue-400/30 text-white'
    }`}
  >
    <div className="flex-shrink-0">
      <Icon size={24} className="drop-shadow-lg" />
    </div>
    <div className="flex-1">
      <p className="font-semibold text-sm">{message}</p>
    </div>
  </motion.div>
);

const VerifyOtp = () => {
  const { isDark } = useTheme(); // ✅ Use global theme context
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [otpError, setOtpError] = useState("");
  
  const inputRefs = useRef([]);
  const email = localStorage.getItem("pendingEmail");
  const name = localStorage.getItem("pendingName");
  const navigate = useNavigate();

  // Enhanced Toast Messages
  const showSuccessToast = (message) => {
    toast.custom((t) => (
      <CustomToast
        type="success"
        message={message}
        icon={CheckCircle}
      />
    ), { duration: 3000 });
  };

  const showErrorToast = (message) => {
    toast.custom((t) => (
      <CustomToast
        type="error"
        message={message}
        icon={AlertCircle}
      />
    ), { duration: 4000 });
  };

  const showInfoToast = (message) => {
    toast.custom((t) => (
      <CustomToast
        type="info"
        message={message}
        icon={Info}
      />
    ), { duration: 3000 });
  };

  // Redirect if no pending email
  useEffect(() => {
    if (!email) {
      showErrorToast("No verification session found. Please register again.");
      setTimeout(() => navigate("/register"), 2000);
    }
  }, [email, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
      if (timeLeft === 0) {
        showInfoToast("OTP expired! You can now request a new one 📧");
      }
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    // Clear error when user starts typing
    if (otpError) setOtpError("");
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      // Clear current field on backspace
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6).split('');
        const newOtp = [...otp];
        digits.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);
        
        // Focus last filled input or next empty
        const lastIndex = Math.min(digits.length - 1, 5);
        inputRefs.current[lastIndex]?.focus();
        
        showInfoToast(`Pasted ${digits.length} digits from clipboard 📋`);
      });
    }
  };

  const validateOtp = () => {
    const otpValue = otp.join("");
    
    if (otpValue.length === 0) {
      setOtpError("Please enter the verification code");
      return false;
    }
    
    if (otpValue.length !== 6) {
      setOtpError("Please enter complete 6-digit code");
      return false;
    }
    
    if (!/^\d{6}$/.test(otpValue)) {
      setOtpError("Only numbers are allowed");
      return false;
    }
    
    return true;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!validateOtp()) {
      showErrorToast(otpError);
      inputRefs.current[0]?.focus();
      return;
    }

    if (timeLeft <= 0) {
      showErrorToast("OTP has expired. Please request a new one.");
      return;
    }

    setLoading(true);
    const otpValue = otp.join("");

    try {
      const res = await axios.post(`${api}/auth/verify-otp`, {
        email,
        otp: otpValue,
        name,
      });

      // Enhanced success message
      showSuccessToast(`🎉 Welcome ${name}! Your account is now verified!`);
      
      localStorage.removeItem("pendingEmail");
      localStorage.removeItem("pendingName");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid verification code. Please try again.";
      showErrorToast(errorMessage);
      
      // Clear OTP on error and add shake effect
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      
      // Shake effect for form on error
      const form = document.getElementById('verify-form');
      if (form) {
        form.classList.add('animate-shake');
        setTimeout(() => form.classList.remove('animate-shake'), 500);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const res = await axios.post(`${api}/auth/resend-otp`, { email });
      showSuccessToast("New verification code sent to your email! 📧");
      
      setTimeLeft(300); // Reset timer
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
      inputRefs.current[0]?.focus();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to resend verification code";
      showErrorToast(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== "");

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden ${
      isDark
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        : "bg-gradient-to-br from-indigo-50 via-purple-100 to-pink-100"
    }`}>
      <Navbar />
      
      {/* Enhanced Modern Toaster */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
          },
        }}
        containerStyle={{
          top: 80, // Account for navbar
        }}
      />

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 50, 0], 
            y: [0, -25, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ repeat: Infinity, duration: 15 }}
          className={`absolute top-1/3 left-1/4 w-64 h-64 rounded-full opacity-20 ${
            isDark ? "bg-indigo-500" : "bg-purple-400"
          } blur-3xl`}
        />
        <motion.div
          animate={{ 
            x: [0, -25, 0], 
            y: [0, 25, 0],
            scale: [1.1, 1, 1.1]
          }}
          transition={{ repeat: Infinity, duration: 20 }}
          className={`absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full opacity-20 ${
            isDark ? "bg-pink-500" : "bg-indigo-400"
          } blur-3xl`}
        />
      </div>

      {/* Floating Icons */}
      <motion.div
        className={`absolute top-24 right-12 ${
          isDark ? "text-indigo-300" : "text-indigo-400"
        }`}
        animate={{ y: [0, 8, 0], rotate: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        <Mail size={35} />
      </motion.div>
      <motion.div
        className={`absolute bottom-32 left-12 ${
          isDark ? "text-purple-300" : "text-purple-400"
        }`}
        animate={{ y: [0, -12, 0], rotate: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      >
        <Shield size={40} />
      </motion.div>

      <div className="flex flex-1 justify-center items-center p-4 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-2xl backdrop-blur-sm ${
                isDark ? "bg-white/10" : "bg-white/20"
              } shadow-lg`}>
                <PassGuardLogo size={48} isDark={isDark} />
              </div>
            </div>
            <h1 className={`text-3xl font-black mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Verify Your <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Email</span>
            </h1>
            <p className={`text-sm leading-relaxed max-w-sm mx-auto ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
              We've sent a 6-digit verification code to
            </p>
            <p className={`font-semibold text-sm ${
              isDark ? "text-indigo-400" : "text-indigo-600"
            }`}>
              {email}
            </p>
          </motion.div>

          {/* Verification Form - REMOVED individual dark mode toggle */}
          <motion.form
            id="verify-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleVerify}
            className={`backdrop-blur-xl rounded-3xl p-8 border shadow-2xl ${
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-white/20 border-white/30"
            }`}
          >
            {/* Timer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center mb-6"
            >
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                isDark ? "bg-white/10" : "bg-white/20"
              }`}>
                <Timer size={16} className={timeLeft < 60 ? "text-red-400" : isDark ? "text-indigo-400" : "text-indigo-600"} />
                <span className={`text-sm font-medium ${
                  timeLeft < 60 ? "text-red-400" : isDark ? "text-indigo-400" : "text-indigo-600"
                }`}>
                  {timeLeft > 0 ? formatTime(timeLeft) : "Expired"}
                </span>
              </div>
            </motion.div>

            {/* OTP Input Fields */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center space-x-3 mb-8"
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-12 text-center text-xl font-bold rounded-xl border-2 transition-all duration-300 ${
                    digit
                      ? isDark
                        ? "border-indigo-500 bg-indigo-500/10 text-white shadow-lg"
                        : "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-lg"
                      : isDark
                        ? "border-white/20 bg-white/5 text-white hover:border-white/40"
                        : "border-white/30 bg-white/10 text-gray-700 hover:border-white/50"
                  } focus:outline-none focus:ring-4 ${
                    isDark ? "focus:ring-indigo-500/30" : "focus:ring-indigo-300/50"
                  }`}
                />
              ))}
            </motion.div>

            {/* Verify Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              type="submit"
              disabled={loading || !isOtpComplete || timeLeft <= 0}
              whileHover={{ scale: loading || !isOtpComplete || timeLeft <= 0 ? 1 : 1.02 }}
              whileTap={{ scale: loading || !isOtpComplete || timeLeft <= 0 ? 1 : 0.98 }}
              className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 mb-4 ${
                loading || !isOtpComplete || timeLeft <= 0
                  ? isDark 
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <MailCheck size={18} />
                  Verify Account
                </span>
              )}
            </motion.button>

            {/* Resend Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              type="button"
              onClick={handleResendOtp}
              disabled={!canResend || resendLoading}
              whileHover={{ scale: !canResend || resendLoading ? 1 : 1.02 }}
              whileTap={{ scale: !canResend || resendLoading ? 1 : 0.98 }}
              className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                !canResend || resendLoading
                  ? isDark 
                    ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200/50 text-gray-400 cursor-not-allowed"
                  : isDark
                    ? "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                    : "bg-white/20 text-gray-700 border border-white/30 hover:bg-white/30"
              }`}
            >
              {resendLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCcw size={18} />
                  </motion.div>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCcw size={18} />
                  {canResend ? "Resend OTP" : "Resend in " + formatTime(timeLeft)}
                </span>
              )}
            </motion.button>

            {/* Help Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-6"
            >
              <p className={`text-xs ${
                isDark ? "text-gray-500" : "text-gray-600"
              }`}>
                Didn't receive the code? Check your spam folder or
              </p>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-indigo-500 hover:text-indigo-600 text-xs font-semibold transition-colors duration-300 hover:underline mt-1"
              >
                try a different email address
              </button>
            </motion.div>
          </motion.form>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-center mt-6 space-x-2"
          >
            <Shield size={16} className={isDark ? "text-green-400" : "text-green-500"} />
            <span className={`text-xs ${
              isDark ? "text-gray-500" : "text-gray-600"
            }`}>
              Your verification is protected with end-to-end encryption
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Add shake animation styles */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default VerifyOtp;
