import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/src/redux/authSlice";
import { useRouter } from "next/router";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { motion } from "framer-motion";
import axios from "axios";
import {
  User,
  Mail,
  Moon,
  Sun,
  Bell,
  Lock,
  LogOut,
  DollarSign,
  Save,
} from "lucide-react";

export default function Settings() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [currency, setCurrency] = useState("USD");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load user settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await axios.get("/api/settings", { withCredentials: true });
        if (res.data) {
          setCurrency(res.data.currency || "USD");
          setDarkMode(res.data.preferences?.darkMode ?? false);
          setNotifications(res.data.preferences?.notifications ?? true);
        }
      } catch (err) {
        console.error("❌ Error fetching settings:", err);
      }
    }
    if (user) fetchSettings();
  }, [user]);

  // Save settings
  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(
        "/api/settings",
        {
          currency,
          preferences: { darkMode, notifications },
        },
        { withCredentials: true }
      );
      setSaving(false);
      alert("✅ Settings updated!");
    } catch (err) {
      console.error("❌ Error saving settings:", err);
      setSaving(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Info */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Profile
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                {user?.name?.[0] || "U"}
              </div>
              <div>
                <p className="flex items-center text-gray-700 font-medium">
                  <User className="w-5 h-5 mr-2 text-gray-500" />
                  {user?.name || "Guest User"}
                </p>
                <p className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-2 text-gray-400" />
                  {user?.email || "No email"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Preferences
            </h2>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="flex items-center text-gray-700 font-medium">
                {darkMode ? (
                  <Moon className="w-5 h-5 mr-2 text-gray-500" />
                ) : (
                  <Sun className="w-5 h-5 mr-2 text-gray-500" />
                )}
                Dark Mode
              </span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full p-1 flex items-center transition ${
                  darkMode ? "bg-indigo-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-md transform transition ${
                    darkMode ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
              </button>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="flex items-center text-gray-700 font-medium">
                <Bell className="w-5 h-5 mr-2 text-gray-500" />
                Notifications
              </span>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full p-1 flex items-center transition ${
                  notifications ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-md transform transition ${
                    notifications ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
              </button>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center justify-between py-4">
              <span className="flex items-center text-gray-700 font-medium">
                <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
                Currency
              </span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="border rounded-lg px-3 py-1 bg-gray-50 text-gray-700"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="PKR">PKR (₨)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-4 flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow transition disabled:opacity-50"
            >
              <Save size={18} /> {saving ? "Saving..." : "Save Settings"}
            </button>
          </motion.div>

          {/* Security */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Security
            </h2>

            <button className="flex items-center gap-2 w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg mb-3 transition">
              <Lock size={18} /> Change Password
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
