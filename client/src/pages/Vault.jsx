// pages/Vault.jsx - Cleaned with Global Theme + Modern Toast
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import AddPassword from "../components/AddPassword";
import EditPassword from "../components/EditPassword";
import { 
  Eye, 
  EyeOff, 
  Edit2, 
  Trash2, 
  LogOut, 
  Search,
  Shield,
  Key,
  Copy,
  CheckCircle,
  Plus,
  Filter,
  MoreVertical,
  AlertCircle,
  Info,
  UserX
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
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
        : type === 'warning'
        ? 'bg-yellow-500/90 border-yellow-400/30 text-white'
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

const Vault = () => {
  const { isDark } = useTheme(); // ✅ Use global theme context
  const [passwords, setPasswords] = useState([]);
  const [filteredPasswords, setFilteredPasswords] = useState([]);
  const [editingPassword, setEditingPassword] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "User";

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

  const showWarningToast = (message) => {
    toast.custom((t) => (
      <CustomToast
        type="warning"
        message={message}
        icon={AlertCircle}
      />
    ), { duration: 3500 });
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  // Filter passwords based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = passwords.filter(pwd => 
        pwd.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pwd.usernameOrEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPasswords(filtered);
    } else {
      setFilteredPasswords(passwords);
    }
  }, [searchQuery, passwords]);

  const fetchPasswords = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showWarningToast("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      const res = await fetch(`${api}/vault`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          showWarningToast("Session expired. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("name");
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch passwords");
      }
      
      const data = await res.json();
      setPasswords(data);
      
      if (data.length === 0) {
        showInfoToast("Your vault is ready! Add your first password to get started 🔐");
      }
    } catch (error) {
      showErrorToast("Failed to load your passwords. Please try again.");
      console.error("Fetch passwords error:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    const password = passwords.find(p => p._id === id);
    setDeleteConfirm({ open: true, id, service: password?.service });
  };

  const handleDeleteConfirmed = async () => {
    const { id, service } = deleteConfirm;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${api}/vault/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("Failed to delete password");
      
      setPasswords(passwords.filter((pwd) => pwd._id !== id));
      showSuccessToast(`${service} password deleted successfully! 🗑️`);
    } catch (error) {
      showErrorToast("Failed to delete password. Please try again.");
    } finally {
      setDeleteConfirm({ open: false, id: null, service: null });
    }
  };

  const handleEdit = (password) => {
    setEditingPassword(password);
    setShowAddForm(false);
    showInfoToast(`Editing ${password.service} password ✏️`);
  };

  const handleUpdate = async (updatedPassword) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${api}/vault/${updatedPassword._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPassword),
      });
      
      if (!res.ok) throw new Error("Failed to update password");
      
      fetchPasswords();
      showSuccessToast(`${updatedPassword.service} password updated successfully! ✨`);
      setEditingPassword(null);
    } catch (error) {
      showErrorToast("Failed to update password. Please try again.");
    }
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
    const password = passwords.find(p => p._id === id);
    if (!visiblePasswords[id]) {
      showInfoToast(`Showing ${password?.service} password 👁️`);
    }
  };

  const copyToClipboard = async (text, type, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      
      const password = passwords.find(p => id.includes(p._id));
      showSuccessToast(`${password?.service} ${type.toLowerCase()} copied! 📋`);
      
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      showErrorToast("Failed to copy to clipboard. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    showSuccessToast(`Goodbye ${name}! Your session has been secured 👋`);
    setTimeout(() => navigate("/login"), 1000);
  };

  const handleAddSuccess = (newPassword) => {
    fetchPasswords();
    showSuccessToast(`${newPassword?.service || 'Password'} added to your vault! 🎉`);
    setShowAddForm(false);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${
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
            x: [0, 100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ repeat: Infinity, duration: 25 }}
          className={`absolute top-1/4 left-1/6 w-96 h-96 rounded-full opacity-10 ${
            isDark ? "bg-indigo-500" : "bg-purple-400"
          } blur-3xl`}
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 60, 0],
            scale: [1.2, 1, 1.2]
          }}
          transition={{ repeat: Infinity, duration: 30 }}
          className={`absolute bottom-1/4 right-1/6 w-80 h-80 rounded-full opacity-10 ${
            isDark ? "bg-pink-500" : "bg-indigo-400"
          } blur-3xl`}
        />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`backdrop-blur-xl rounded-3xl p-6 border shadow-lg mb-8 ${
            isDark
              ? "bg-white/5 border-white/10"
              : "bg-white/20 border-white/30"
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-2xl backdrop-blur-sm ${
                isDark ? "bg-white/10" : "bg-white/20"
              } shadow-lg`}>
                <PassGuardLogo size={40} isDark={isDark} />
              </div>
              <div>
                <h1 className={`text-2xl md:text-3xl font-black ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  Welcome back, <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">{name}</span> 👋
                </h1>
                <p className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  {loading ? (
                    "Loading your vault..."
                  ) : (
                    <>You have <span className="font-semibold text-indigo-500">{passwords.length}</span> password{passwords.length !== 1 ? 's' : ''} in your secure vault</>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const newShowForm = !showAddForm;
                  setShowAddForm(newShowForm);
                  setEditingPassword(null);
                  if (newShowForm) {
                    showInfoToast("Ready to add a new password! 🔐");
                  }
                }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  showAddForm 
                    ? isDark 
                      ? "bg-gray-600 text-white hover:bg-gray-500" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                <Plus size={18} />
                <span>{showAddForm ? "Cancel" : "Add Password"}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  isDark 
                    ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                    : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                }`}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className={`backdrop-blur-xl rounded-2xl p-4 border shadow-lg mb-8 ${
            isDark
              ? "bg-white/5 border-white/10"
              : "bg-white/20 border-white/30"
          }`}
        >
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`} size={20} />
            <input
              type="text"
              placeholder={`Search through ${passwords.length} passwords...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-transparent backdrop-blur-sm transition-all duration-300 ${
                isDark
                  ? "border-white/20 text-white placeholder-gray-400 focus:border-indigo-500"
                  : "border-white/30 text-gray-700 placeholder-gray-500 focus:border-indigo-500"
              } focus:outline-none focus:ring-4 focus:ring-indigo-500/20`}
            />
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchQuery("")}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                  isDark 
                    ? "hover:bg-white/10 text-gray-400 hover:text-white" 
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
              >
                <Plus size={16} className="rotate-45" />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Add/Edit Password Forms */}
        <AnimatePresence>
          {showAddForm && !editingPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <AddPassword onAdd={handleAddSuccess} isDark={isDark} />
            </motion.div>
          )}
          
          {editingPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <EditPassword
                currentPassword={editingPassword}
                onEdit={handleUpdate}
                onCancel={() => {
                  setEditingPassword(null);
                  showInfoToast("Edit cancelled");
                }}
                isDark={isDark}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {loading ? (
            // Loading skeleton
            Array(6).fill(0).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: index * 0.1 }}
                className={`backdrop-blur-xl rounded-3xl p-6 border ${
                  isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-white/20 border-white/30"
                }`}
              >
                <div className={`h-6 rounded mb-4 ${isDark ? "bg-gray-700" : "bg-gray-300"}`} />
                <div className={`h-4 rounded mb-2 ${isDark ? "bg-gray-700" : "bg-gray-300"}`} />
                <div className={`h-4 rounded w-2/3 mb-4 ${isDark ? "bg-gray-700" : "bg-gray-300"}`} />
                <div className={`h-10 rounded ${isDark ? "bg-gray-700" : "bg-gray-300"}`} />
              </motion.div>
            ))
          ) : (
            <AnimatePresence>
              {filteredPasswords.length > 0 ? (
                filteredPasswords.map((pwd, index) => (
                  <motion.div
                    key={pwd._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`backdrop-blur-xl rounded-3xl p-6 border shadow-lg hover:shadow-2xl transition-all duration-300 ${
                      isDark
                        ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                        : "bg-white/20 border-white/30 hover:bg-white/30 hover:border-white/40"
                    }`}
                  >
                    {/* Service Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-xl ${
                          isDark ? "bg-indigo-500/20" : "bg-indigo-100"
                        }`}>
                          <Key size={18} className={isDark ? "text-indigo-400" : "text-indigo-600"} />
                        </div>
                        <div>
                          <h3 className={`font-bold text-lg truncate ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}>
                            {pwd.service}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Username/Email */}
                    <div className="mb-4">
                      <p className={`text-xs uppercase tracking-wide font-medium mb-1 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}>
                        Username/Email
                      </p>
                      <div className="flex items-center justify-between">
                        <p className={`truncate font-mono text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}>
                          {pwd.usernameOrEmail}
                        </p>
                        <button
                          onClick={() => copyToClipboard(pwd.usernameOrEmail, "Username", `${pwd._id}-username`)}
                          className={`ml-2 p-1 rounded-lg transition-colors duration-200 ${
                            isDark 
                              ? "hover:bg-white/10 text-gray-400 hover:text-white" 
                              : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {copiedId === `${pwd._id}-username` ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                      <p className={`text-xs uppercase tracking-wide font-medium mb-1 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}>
                        Password
                      </p>
                      <div className={`flex items-center justify-between p-3 rounded-xl ${
                        isDark ? "bg-gray-700/50" : "bg-gray-100/50"
                      }`}>
                        <span className={`font-mono text-sm flex-1 truncate ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}>
                          {visiblePasswords[pwd._id] ? pwd.password : "••••••••••••"}
                        </span>
                        <div className="flex items-center space-x-2 ml-2">
                          <button
                            onClick={() => copyToClipboard(pwd.password, "Password", `${pwd._id}-password`)}
                            className={`p-1 rounded-lg transition-colors duration-200 ${
                              isDark 
                                ? "hover:bg-white/10 text-gray-400 hover:text-white" 
                                : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            {copiedId === `${pwd._id}-password` ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                          </button>
                          <button
                            onClick={() => togglePasswordVisibility(pwd._id)}
                            className={`p-1 rounded-lg transition-colors duration-200 ${
                              isDark 
                                ? "hover:bg-white/10 text-gray-400 hover:text-white" 
                                : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            {visiblePasswords[pwd._id] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(pwd)}
                        className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
                      >
                        <Edit2 size={14} />
                        <span>Edit</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => confirmDelete(pwd._id)}
                        className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="col-span-full text-center py-16"
                >
                  <div className={`backdrop-blur-xl rounded-3xl p-12 border ${
                    isDark
                      ? "bg-white/5 border-white/10"
                      : "bg-white/20 border-white/30"
                  }`}>
                    <Shield size={64} className={`mx-auto mb-4 ${
                      isDark ? "text-gray-600" : "text-gray-400"
                    }`} />
                    <h3 className={`text-xl font-bold mb-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}>
                      {searchQuery ? "No passwords found" : "Your vault is empty"}
                    </h3>
                    <p className={`mb-6 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {searchQuery 
                        ? `No passwords match "${searchQuery}". Try a different search term.`
                        : "Start building your secure password collection by adding your first password."
                      }
                    </p>
                    {!searchQuery && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setShowAddForm(true);
                          showInfoToast("Let's add your first password! 🚀");
                        }}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Add Your First Password
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteConfirm({ open: false, id: null, service: null })}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className={`backdrop-blur-xl rounded-3xl p-8 border shadow-2xl w-full max-w-md ${
                isDark
                  ? "bg-gray-800/90 border-white/10"
                  : "bg-white/90 border-white/30"
              }`}
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isDark ? "bg-red-500/20" : "bg-red-100"
                }`}>
                  <Trash2 size={32} className="text-red-500" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  Delete {deleteConfirm.service} Password?
                </h3>
                <p className={`mb-8 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  This action cannot be undone. The password for <strong>{deleteConfirm.service}</strong> will be permanently removed from your vault.
                </p>
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDeleteConfirm({ open: false, id: null, service: null })}
                    className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all duration-300 ${
                      isDark 
                        ? "bg-gray-600 text-white hover:bg-gray-500"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Keep Password
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDeleteConfirmed}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Delete Forever
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Vault;
