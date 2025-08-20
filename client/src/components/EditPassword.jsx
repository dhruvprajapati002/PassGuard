import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AppWindow,
  AtSign,
  Lock,
  Eye,
  EyeOff,
  Save,
  X,
  Shield,
  CheckCircle,
  AlertCircle,
  Edit3
} from "lucide-react";
import toast from "react-hot-toast";

// Enhanced Password Strength Checker (matching other components)
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
    0: { label: "Enter password", color: "from-gray-400 to-gray-500", textColor: "text-gray-500" },
    1: { label: "Very Weak", color: "from-red-500 to-red-600", textColor: "text-red-600" },
    2: { label: "Weak", color: "from-orange-500 to-red-500", textColor: "text-orange-600" }, 
    3: { label: "Fair", color: "from-yellow-400 to-orange-500", textColor: "text-yellow-600" },
    4: { label: "Strong", color: "from-green-400 to-green-600", textColor: "text-green-600" },
    5: { label: "Very Strong", color: "from-green-500 to-emerald-600", textColor: "text-green-700" }
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
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative mb-4"
  >
    <div className="relative">
      <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
        focusedField === field 
          ? isDark ? "text-indigo-400" : "text-indigo-600"
          : isDark ? "text-gray-400" : "text-gray-500"
      }`}>
        <Icon size={18} />
      </div>
      
      <input
        type={type === "password" && showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => onFocus(field)}
        onBlur={() => onBlur()}
        required={required}
        className={`w-full pl-11 pr-11 py-3 rounded-xl border-2 bg-transparent backdrop-blur-sm transition-all duration-300 ${
          focusedField === field
            ? isDark
              ? "border-indigo-500 shadow-lg shadow-indigo-500/20 text-white"
              : "border-indigo-500 shadow-lg shadow-indigo-500/20 text-gray-900"
            : isDark
              ? "border-white/20 text-gray-300"
              : "border-white/30 text-white"
        } ${isDark ? "placeholder-gray-400" : "placeholder-white/70"} focus:outline-none`}
      />

      {type === "password" && (
        <button
          type="button"
          onClick={onTogglePassword}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
            isDark ? "text-gray-400 hover:text-white" : "text-white/70 hover:text-white"
          }`}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  </motion.div>
));

const EditPassword = ({ currentPassword, onEdit, onCancel, isDark = false }) => {
  const [formData, setFormData] = useState({
    service: currentPassword.service,
    usernameOrEmail: currentPassword.usernameOrEmail,
    password: currentPassword.password
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.service.trim() || !formData.usernameOrEmail.trim() || !formData.password.trim()) {
      toast.error("Please fill all fields!");
      return;
    }

    if (passwordStrength.score < 3) {
      toast.error("Please use a stronger password for better security");
      return;
    }

    setSubmitting(true);
    
    try {
      await onEdit({ ...currentPassword, ...formData });
      toast.success("Password updated successfully! ✅");
    } catch (error) {
      toast.error("Failed to update password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const isFormValid = formData.service.trim() && formData.usernameOrEmail.trim() && formData.password.trim() && passwordStrength.score >= 3;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className={`backdrop-blur-xl rounded-3xl border shadow-2xl w-full max-w-md ${
          isDark
            ? "bg-gray-800/90 border-white/10"
            : "bg-white/90 border-white/30"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${
              isDark ? "bg-indigo-500/20" : "bg-indigo-100"
            }`}>
              <Edit3 size={20} className={isDark ? "text-indigo-400" : "text-indigo-600"} />
            </div>
            <div>
              <h2 className={`text-xl font-black ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                Edit <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Password</span>
              </h2>
              <p className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                Update your stored credentials
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onCancel}
            className={`p-2 rounded-xl transition-colors duration-200 ${
              isDark 
                ? "hover:bg-white/10 text-gray-400 hover:text-white" 
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
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

          {/* Password Strength Indicator */}
          <AnimatePresence>
            {formData.password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
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
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {Object.entries(passwordStrength.checks).map(([key, met]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {met ? (
                          <CheckCircle size={12} className="text-green-500" />
                        ) : (
                          <AlertCircle size={12} className={isDark ? "text-gray-500" : "text-gray-400"} />
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
          <div className="flex space-x-3">
            <motion.button
              type="button"
              onClick={onCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                isDark 
                  ? "bg-gray-600 text-white hover:bg-gray-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Cancel
            </motion.button>
            
            <motion.button
              type="submit"
              disabled={submitting || !isFormValid}
              whileHover={{ scale: submitting || !isFormValid ? 1 : 1.02 }}
              whileTap={{ scale: submitting || !isFormValid ? 1 : 0.98 }}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
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
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`mt-4 p-3 rounded-xl ${
              isDark ? "bg-green-500/10 border border-green-500/20" : "bg-green-50 border border-green-200"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Shield size={14} className="text-green-500" />
              <p className={`text-xs ${
                isDark ? "text-green-400" : "text-green-700"
              }`}>
                Changes will be encrypted and stored securely.
              </p>
            </div>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditPassword;
