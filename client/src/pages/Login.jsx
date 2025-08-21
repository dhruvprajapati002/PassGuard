// pages/Login.jsx - Cleaned with Global Theme + Modern Toast
import React, { useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn,
  Sparkles,
  KeyRound,
  CheckCircle,
  AlertCircle,
  Info
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

// Enhanced Input Field Component
const InputField = React.memo(({ 
  icon: Icon, 
  type, 
  placeholder, 
  value, 
  onChange, 
  field,
  required = true,
  showPassword,
  onTogglePassword,
  focusedField,
  onFocus,
  onBlur,
  isDark,
  error
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative mb-6"
  >
    <div className="relative">
      <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
        error 
          ? "text-red-500"
          : focusedField === field 
            ? isDark ? "text-indigo-400" : "text-indigo-600"
            : isDark ? "text-gray-400" : "text-gray-600"
      }`}>
        <Icon size={20} />
      </div>
      
      <input
        type={type === "password" && showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        onFocus={() => onFocus(field)}
        onBlur={() => onBlur()}
        required={required}
        className={`w-full pl-12 pr-12 py-4 rounded-2xl border-2 bg-transparent backdrop-blur-sm transition-all duration-300 ${
          error
            ? "border-red-500 shadow-lg shadow-red-500/20"
            : focusedField === field
              ? isDark
                ? "border-indigo-500 shadow-lg shadow-indigo-500/20 text-white"
                : "border-indigo-500 shadow-lg shadow-indigo-500/20 text-gray-900"
              : isDark
                ? "border-white/20 text-gray-300"
                : "border-white/30 text-gray-900"
        } ${
          isDark 
            ? "placeholder-gray-400" 
            : "placeholder-gray-600"
        } focus:outline-none`}
      />

      {type === "password" && (
        <button
          type="button"
          onClick={onTogglePassword}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
            isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
    
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 text-sm mt-2 flex items-center space-x-1"
      >
        <AlertCircle size={14} />
        <span>{error}</span>
      </motion.p>
    )}
  </motion.div>
));

const Login = () => {
  const { isDark } = useTheme(); // ✅ Use global theme context
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [errors, setErrors] = useState({});

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

  // Memoized event handlers
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const handleFocus = useCallback((field) => {
    setFocusedField(field);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedField("");
  }, []);

  const handleTogglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      showErrorToast("Please fix the errors below");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${api}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      // Save token & user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.user.name);

      // Enhanced success message
      showSuccessToast(`Welcome back, ${res.data.user.name}! 🎉`);
      
      // Smooth transition to vault
      setTimeout(() => {
        navigate("/vault");
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid credentials";
      showErrorToast(errorMessage);
      
      // Shake effect for form on error
      const form = document.getElementById('login-form');
      if (form) {
        form.classList.add('animate-shake');
        setTimeout(() => form.classList.remove('animate-shake'), 500);
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password && Object.keys(errors).length === 0;

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
            x: [0, 80, 0], 
            y: [0, -40, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ repeat: Infinity, duration: 18 }}
          className={`absolute top-1/3 left-1/4 w-64 h-64 rounded-full opacity-20 ${
            isDark ? "bg-indigo-500" : "bg-purple-400"
          } blur-3xl`}
        />
        <motion.div
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 40, 0],
            scale: [1.1, 1, 1.1]
          }}
          transition={{ repeat: Infinity, duration: 22 }}
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
        animate={{ y: [0, 12, 0], rotate: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 4.5 }}
      >
        <KeyRound size={38} />
      </motion.div>
      <motion.div
        className={`absolute bottom-32 left-12 ${
          isDark ? "text-purple-300" : "text-purple-400"
        }`}
        animate={{ y: [0, -10, 0], rotate: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 5.5 }}
      >
        <Shield size={42} />
      </motion.div>

      <div className="flex flex-1 justify-center items-center p-4 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
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
              Welcome Back to <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">PassGuard</span>
            </h1>
            <p className={`text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
              Access your secure password vault
            </p>
          </motion.div>

          {/* Login Form - REMOVED individual dark mode toggle */}
          <motion.form
            id="login-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleLogin}
            className={`backdrop-blur-xl rounded-3xl p-8 border shadow-2xl ${
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-white/20 border-white/30"
            }`}
          >
            <InputField
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              field="email"
              focusedField={focusedField}
              onFocus={handleFocus}
              onBlur={handleBlur}
              isDark={isDark}
              error={errors.email}
            />

            <InputField
              icon={Lock}
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              field="password"
              showPassword={showPassword}
              onTogglePassword={handleTogglePassword}
              focusedField={focusedField}
              onFocus={handleFocus}
              onBlur={handleBlur}
              isDark={isDark}
              error={errors.password}
            />

            {/* Forgot Password Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-right mb-6"
            >
              <button
                type="button"
                onClick={() => showInfoToast("Password recovery feature coming soon! 🔧")}
                className="text-indigo-500 hover:text-indigo-600 text-sm font-medium transition-colors duration-300 hover:underline"
              >
                Forgot Password?
              </button>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              type="submit"
              disabled={loading || !isFormValid}
              whileHover={{ scale: loading || !isFormValid ? 1 : 1.02 }}
              whileTap={{ scale: loading || !isFormValid ? 1 : 0.98 }}
              className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 mb-6 ${
                loading || !isFormValid
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
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn size={18} />
                  Sign In
                </span>
              )}
            </motion.button>

            {/* Register Link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className={`text-center text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-indigo-500 hover:text-indigo-600 font-semibold transition-colors duration-300 hover:underline"
              >
                Create Account
              </button>
            </motion.p>
          </motion.form>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center mt-6 space-x-2"
          >
            <Shield size={16} className={isDark ? "text-green-400" : "text-green-500"} />
            <span className={`text-xs ${
              isDark ? "text-gray-500" : "text-gray-600"
            }`}>
              Secured with 256-bit encryption
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

export default Login;
