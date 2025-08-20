import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  AtSign,
  Lock,
  Eye,
  EyeOff,
  AppWindow,
  Sparkles,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Shield
} from "lucide-react";
import toast from "react-hot-toast";

// Enhanced Password Strength Checker (matching Register component)
const getPasswordStrength = (password) => {
  let score = 0;
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password), 
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  score = Object.values(checks).filter(Boolean).length;

  const strengthMap = {
    0: { label: "Enter password", color: "from-gray-400 to-gray-500", bgColor: "bg-gray-200", textColor: "text-gray-500" },
    1: { label: "Very Weak", color: "from-red-500 to-red-600", bgColor: "bg-red-100", textColor: "text-red-600" },
    2: { label: "Weak", color: "from-orange-500 to-red-500", bgColor: "bg-orange-100", textColor: "text-orange-600" }, 
    3: { label: "Fair", color: "from-yellow-400 to-orange-500", bgColor: "bg-yellow-100", textColor: "text-yellow-600" },
    4: { label: "Strong", color: "from-green-400 to-green-600", bgColor: "bg-green-100", textColor: "text-green-600" },
    5: { label: "Very Strong", color: "from-green-500 to-emerald-600", bgColor: "bg-green-100", textColor: "text-green-700" }
  };

  return { 
    score, 
    checks,
    ...strengthMap[score] 
  };
};

// Input Field Component
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
  isDark
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative"
  >
    <div className="relative">
      <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
        focusedField === field 
          ? isDark ? "text-indigo-400" : "text-indigo-600"
          : isDark ? "text-gray-400" : "text-gray-500"
      }`}>
        <Icon size={20} />
      </div>
      
      <input
        type={type === "password" && showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => onFocus(field)}
        onBlur={() => onBlur()}
        required={required}
        className={`w-full pl-12 pr-12 py-4 rounded-2xl border-2 bg-transparent backdrop-blur-sm transition-all duration-300 ${
          focusedField === field
            ? isDark
              ? "border-indigo-500 shadow-lg shadow-indigo-500/20 text-white"
              : "border-indigo-500 shadow-lg shadow-indigo-500/20 text-gray-900"
            : isDark
              ? "border-white/20 text-gray-300"
              : "border-gray-200 text-gray-900"
        } ${isDark ? "placeholder-gray-400" : "placeholder-gray-500"} focus:outline-none`}
      />

      {type === "password" && (
        <button
          type="button"
          onClick={onTogglePassword}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
            isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  </motion.div>
));

const AddPassword = ({ onAdd, isDark = false }) => {
  const [formData, setFormData] = useState({
    service: "",
    usernameOrEmail: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const passwordStrength = getPasswordStrength(formData.password);

  // Memoized event handlers
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleFocus = useCallback((field) => {
    setFocusedField(field);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedField("");
  }, []);

  const handleTogglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const generatePassword = useCallback(() => {
    setIsGenerating(true);
    
    // Add a small delay for better UX
    setTimeout(() => {
      const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const lower = "abcdefghijklmnopqrstuvwxyz";
      const nums = "0123456789";
      const syms = "!@#$%^&*()_+~{}[]:;<>,.?/-=";

      // Ensure at least one of each character type
      let pwd = [
        upper[Math.floor(Math.random() * upper.length)],
        lower[Math.floor(Math.random() * lower.length)],
        nums[Math.floor(Math.random() * nums.length)],
        syms[Math.floor(Math.random() * syms.length)],
      ];

      const all = upper + lower + nums + syms;
      for (let i = 0; i < 12; i++) {
        pwd.push(all[Math.floor(Math.random() * all.length)]);
      }

      // Shuffle array
      pwd = pwd.sort(() => 0.5 - Math.random()).join("");

      setFormData(prev => ({ ...prev, password: pwd }));
      toast.success("Strong password generated! ✨");
      setIsGenerating(false);
    }, 500);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordStrength.score < 3) {
      toast.error("Please use a stronger password for better security");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${api}/vault/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add password");

      toast.success("Password added successfully! 🔐");
      setFormData({
        service: "",
        usernameOrEmail: "",
        password: ""
      });
      onAdd?.();
    } catch (err) {
      toast.error("Failed to add password. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = formData.service && formData.usernameOrEmail && formData.password && passwordStrength.score >= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-6xl mx-auto"
    >
      <motion.form
        onSubmit={handleSubmit}
        className={`backdrop-blur-xl rounded-3xl p-8 border shadow-2xl transition-all duration-500 hover:shadow-3xl ${
          isDark
            ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
            : "bg-white/20 border-white/30 hover:bg-white/30 hover:border-white/40"
        }`}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center space-x-3 mb-8"
        >
          <div className={`p-3 rounded-2xl ${
            isDark ? "bg-indigo-500/20" : "bg-indigo-100"
          }`}>
            <PlusCircle size={24} className={isDark ? "text-indigo-400" : "text-indigo-600"} />
          </div>
          <div>
            <h2 className={`text-2xl font-black ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Add New <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Password</span>
            </h2>
            <p className={`text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
              Securely store your credentials with PassGuard
            </p>
          </div>
        </motion.div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <InputField
            icon={AppWindow}
            type="text"
            placeholder="Service (e.g., Gmail, GitHub)"
            value={formData.service}
            onChange={(e) => handleInputChange("service", e.target.value)}
            field="service"
            focusedField={focusedField}
            onFocus={handleFocus}
            onBlur={handleBlur}
            isDark={isDark}
          />

          <InputField
            icon={AtSign}
            type="text"
            placeholder="Username or Email"
            value={formData.usernameOrEmail}
            onChange={(e) => handleInputChange("usernameOrEmail", e.target.value)}
            field="usernameOrEmail"
            focusedField={focusedField}
            onFocus={handleFocus}
            onBlur={handleBlur}
            isDark={isDark}
          />

          <InputField
            icon={Lock}
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            field="password"
            showPassword={showPassword}
            onTogglePassword={handleTogglePassword}
            focusedField={focusedField}
            onFocus={handleFocus}
            onBlur={handleBlur}
            isDark={isDark}
          />
        </div>

        {/* Password Strength Indicator */}
        <AnimatePresence>
          {formData.password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Password Strength
                </span>
                <span className={`text-sm font-semibold ${passwordStrength.textColor}`}>
                  {passwordStrength.label}
                </span>
              </div>
              
              <div className={`w-full h-2 rounded-full ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              }`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-2 rounded-full bg-gradient-to-r ${passwordStrength.color}`}
                />
              </div>

              {/* Password Requirements */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
                {Object.entries(passwordStrength.checks).map(([key, met]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {met ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <AlertCircle size={16} className={isDark ? "text-gray-500" : "text-gray-400"} />
                      )}
                    </motion.div>
                    <span className={`text-xs ${
                      met 
                        ? "text-green-400" 
                        : isDark ? "text-gray-400" : "text-gray-500"
                    }`}>
                      {key === 'length' ? '8+ chars' :
                       key === 'upper' ? 'Uppercase' :
                       key === 'lower' ? 'Lowercase' :
                       key === 'number' ? 'Number' : 'Special'}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between"
        >
          <motion.button
            type="button"
            onClick={generatePassword}
            disabled={isGenerating}
            whileHover={{ scale: isGenerating ? 1 : 1.02 }}
            whileTap={{ scale: isGenerating ? 1 : 0.98 }}
            className={`flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
              isDark 
                ? "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30"
                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300"
            } ${isGenerating ? "cursor-not-allowed" : ""}`}
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw size={18} />
                </motion.div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Generate Strong Password</span>
              </>
            )}
          </motion.button>

          <motion.button
            type="submit"
            disabled={submitting || !isFormValid}
            whileHover={{ scale: submitting || !isFormValid ? 1 : 1.02 }}
            whileTap={{ scale: submitting || !isFormValid ? 1 : 0.98 }}
            className={`flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
              submitting || !isFormValid
                ? isDark 
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {submitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Adding Password...</span>
              </>
            ) : (
              <>
                <Shield size={18} />
                <span>Add to Vault</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`mt-6 p-4 rounded-xl ${
            isDark ? "bg-green-500/10 border border-green-500/20" : "bg-green-50 border border-green-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Shield size={16} className="text-green-500" />
            <p className={`text-xs ${
              isDark ? "text-green-400" : "text-green-700"
            }`}>
              Your password will be encrypted with AES-256 encryption before being stored securely.
            </p>
          </div>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default AddPassword;
