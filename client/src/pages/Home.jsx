// pages/Home.jsx - Cleaned with Global Theme Context
import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


import { 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  Users, 
  Globe, 
  Star,
  CheckCircle2,
  ArrowRight,
  Zap,
  Eye,
  Smartphone,
  Cloud,
  Award
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

// Logo Components
const PassGuardLogo = ({ size = 40, isDark = false }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="inline-block">
    {/* Shield base */}
    <path
      d="M50 10 L20 25 L20 50 Q20 75 50 90 Q80 75 80 50 L80 25 Z"
      fill={isDark ? "#6366f1" : "#4f46e5"}
      className="drop-shadow-lg"
    />
    {/* Inner shield */}
    <path
      d="M50 20 L30 30 L30 50 Q30 65 50 75 Q70 65 70 50 L70 30 Z"
      fill={isDark ? "#8b5cf6" : "#7c3aed"}
    />
    {/* Key symbol */}
    <circle cx="45" cy="45" r="6" fill="white" />
    <rect x="48" y="42" width="12" height="3" fill="white" rx="1" />
    <rect x="57" y="39" width="3" height="3" fill="white" />
    <rect x="57" y="45" width="3" height="3" fill="white" />
  </svg>
);

const TextLogo = ({ isDark = false }) => (
  <div className="flex items-center space-x-2 mb-8">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
      isDark ? "bg-gradient-to-br from-indigo-400 to-purple-500" : "bg-gradient-to-br from-indigo-500 to-purple-600"
    } shadow-lg`}>
      <Lock className="w-6 h-6 text-white" />
    </div>
    <span className={`text-3xl font-black tracking-tight ${
      isDark ? "text-white" : "text-gray-900"
    }`}>
      Pass<span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Guard</span>
    </span>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme(); // ✅ Use global theme context

  const features = [
    { 
      icon: ShieldCheck, 
      title: "Military-Grade Security", 
      desc: "AES-256 encryption protects your data with unbreakable security" 
    },
    { 
      icon: KeyRound, 
      title: "Smart Password Generator", 
      desc: "Create unbreakable passwords instantly with customizable options" 
    },
    { 
      icon: Lock, 
      title: "Zero-Knowledge Architecture", 
      desc: "Even we can't see your passwords - complete privacy guaranteed" 
    }
  ];

  const stats = [
    { number: "10,000+", label: "Trusted Users", icon: Users },
    { number: "99.9%", label: "Uptime", icon: Zap },
    { number: "256-bit", label: "Encryption", icon: ShieldCheck },
    { number: "24/7", label: "Support", icon: Globe }
  ];

  const benefits = [
    "Access your passwords anywhere, anytime",
    "Generate strong, unique passwords instantly",
    "Secure password sharing with team members",
    "Automatic form filling and login",
    "Cross-platform synchronization",
    "Breach monitoring and alerts"
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Security Engineer",
      content: "PassGuard has revolutionized how I manage passwords. The security features are enterprise-grade!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Small Business Owner",
      content: "Finally, a password manager that's both secure and easy to use. My team loves it!",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Freelance Designer",
      content: "The best investment for my digital security. Clean interface and powerful features.",
      rating: 5
    }
  ];

  return (
    <>
      <Navbar />
      <div className={`relative overflow-hidden transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-50 via-purple-100 to-pink-100 text-gray-900"
      }`}>
        
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated gradient orbs */}
          <motion.div
            animate={{ 
              x: [0, 100, 0], 
              y: [0, -100, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ repeat: Infinity, duration: 20 }}
            className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 ${
              isDark ? "bg-indigo-500" : "bg-purple-400"
            } blur-3xl`}
          />
          <motion.div
            animate={{ 
              x: [0, -100, 0], 
              y: [0, 100, 0],
              scale: [1.2, 1, 1.2]
            }}
            transition={{ repeat: Infinity, duration: 25 }}
            className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-20 ${
              isDark ? "bg-pink-500" : "bg-indigo-400"
            } blur-3xl`}
          />
        </div>

        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 pt-20">
          {/* Floating Icons */}
          <motion.div
            className={`absolute top-32 left-10 ${
              isDark ? "text-indigo-300" : "text-indigo-400"
            }`}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ShieldCheck size={60} />
          </motion.div>
          <motion.div
            className={`absolute bottom-32 right-10 ${
              isDark ? "text-pink-300" : "text-pink-400"
            }`}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <KeyRound size={60} />
          </motion.div>
          <motion.div
            className={`absolute top-52 right-1/4 ${
              isDark ? "text-purple-300" : "text-purple-400"
            }`}
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
          >
            <Lock size={60} />
          </motion.div>

          {/* Main Glass Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className={`backdrop-blur-lg shadow-xl rounded-3xl p-10 max-w-4xl border transition-all duration-500 hover:shadow-2xl
              ${
                isDark
                  ? "bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30"
                  : "bg-white/30 border-white/40 hover:bg-white/40 hover:border-white/50"
              }`}
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex justify-center"
            >
              <TextLogo isDark={isDark} />
            </motion.div>

            {/* Enhanced Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className={`text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Welcome to{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                PassGuard
              </span>
            </motion.h1>

            {/* Enhanced Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-4 mb-10"
            >
              <p className={`text-xl md:text-2xl font-semibold ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}>
                Your Digital Fortress for Password Security
              </p>
              <p className={`text-base md:text-lg leading-relaxed max-w-2xl mx-auto ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                Enterprise-grade encryption meets intuitive design. Store, generate, and manage all your passwords with military-grade security that even we can't access.
              </p>
            </motion.div>

            {/* Modern Button Group */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/register")}
                className="group px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  Get Started Free
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className={`px-10 py-4 rounded-2xl border-2 font-bold transition-all duration-300 ${
                  isDark 
                    ? "border-white/20 text-white hover:bg-white/10 hover:border-white/30" 
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                Sign In
              </motion.button>
            </motion.div>

            {/* Feature Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className={`p-6 rounded-2xl backdrop-blur-lg border transition-all duration-300 ${
                    isDark 
                      ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20" 
                      : "bg-white/20 border-white/30 hover:bg-white/30 hover:border-white/40"
                  }`}
                >
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className="mb-4"
                  >
                    <feature.icon className={`w-12 h-12 ${
                      isDark ? "text-indigo-300" : "text-indigo-600"
                    }`} />
                  </motion.div>
                  <h3 className={`font-bold text-xl mb-3 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8"
          >
            <p className={`text-sm font-medium ${isDark ? "text-gray-500" : "text-gray-500"}`}>
              🔒 Join 10,000+ users who trust PassGuard with their digital security
            </p>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="relative py-20 px-6">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`backdrop-blur-xl rounded-3xl p-8 border shadow-lg ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white/20 border-white/30"
              }`}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    className="text-center"
                  >
                    <div className={`inline-flex p-4 rounded-2xl mb-4 ${
                      isDark ? "bg-indigo-500/20" : "bg-indigo-100"
                    }`}>
                      <stat.icon className={`w-8 h-8 ${
                        isDark ? "text-indigo-400" : "text-indigo-600"
                      }`} />
                    </div>
                    <div className={`text-3xl font-black mb-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}>
                      {stat.number}
                    </div>
                    <div className={`text-sm font-medium ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="relative py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className={`text-4xl md:text-5xl font-black mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                Why Choose <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">PassGuard</span>?
              </h2>
              <p className={`text-xl max-w-2xl mx-auto ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                Experience the perfect balance of security and simplicity
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ x: 10 }}
                    className="flex items-center space-x-4"
                  >
                    <div className={`flex-shrink-0 p-2 rounded-full ${
                      isDark ? "bg-green-500/20" : "bg-green-100"
                    }`}>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <span className={`text-lg font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {benefit}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`backdrop-blur-xl rounded-3xl p-8 border ${
                  isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-white/20 border-white/30"
                }`}
              >
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: Smartphone, title: "Cross-Platform", desc: "Works on all devices" },
                    { icon: Cloud, title: "Cloud Sync", desc: "Always up to date" },
                    { icon: Eye, title: "Zero Knowledge", desc: "Complete privacy" },
                    { icon: Award, title: "Award Winning", desc: "Industry recognized" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="text-center"
                    >
                      <item.icon className={`w-12 h-12 mx-auto mb-4 ${
                        isDark ? "text-indigo-400" : "text-indigo-600"
                      }`} />
                      <h4 className={`font-bold mb-2 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}>
                        {item.title}
                      </h4>
                      <p className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}>
                        {item.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="relative py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className={`text-4xl md:text-5xl font-black mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                Loved by <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Thousands</span>
              </h2>
              <p className={`text-xl max-w-2xl mx-auto ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                See what our users are saying about PassGuard
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`backdrop-blur-xl rounded-3xl p-8 border ${
                    isDark
                      ? "bg-white/5 border-white/10"
                      : "bg-white/20 border-white/30"
                  }`}
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className={`text-lg mb-6 leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className={`font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}>
                      {testimonial.name}
                    </div>
                    <div className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {testimonial.role}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative py-20 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`backdrop-blur-xl rounded-3xl p-12 border ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white/20 border-white/30"
              }`}
            >
              <h2 className={`text-4xl md:text-5xl font-black mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                Ready to Secure Your Digital Life?
              </h2>
              <p className={`text-xl mb-8 max-w-2xl mx-auto ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                Join thousands of users who have made the smart choice for password security
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/register")}
                className="inline-flex items-center px-12 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
