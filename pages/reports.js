// pages/reports.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { logoutUser } from "@/src/redux/authSlice";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { motion } from "framer-motion";
import {
  DollarSign,
  PieChart as PieIcon,
  BarChart as BarIcon,
  FileDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
} from "recharts";

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");

    async function fetchSummary() {
      try {
        const res = await axios.get("/api/expenses/summary", {
          withCredentials: true,
        });
        setSummary(res.data);
      } catch (error) {
        if (error.response?.status === 401) {
          dispatch(logoutUser());
          router.push("/login");
        } else {
          console.error("❌ Error fetching reports:", error);
        }
      }
    }

    if (user) fetchSummary();
  }, [user, dispatch, router]);

  const COLORS = [
    "#6366F1",
    "#EC4899",
    "#10B981",
    "#F59E0B",
    "#3B82F6",
    "#EF4444",
    "#8B5CF6",
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Reports</h1>

        {!summary ? (
          <p className="text-gray-600">Loading reports...</p>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="p-6 bg-white rounded-2xl shadow-md text-center"
              >
                <DollarSign className="w-8 h-8 text-indigo-500 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-800 mt-2">
                  Total Expenses
                </h3>
                <p className="text-2xl font-bold text-indigo-700 mt-2">
                  ${summary.total.toFixed(2)}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="p-6 bg-white rounded-2xl shadow-md text-center"
              >
                <PieIcon className="w-8 h-8 text-purple-500 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-800 mt-2">
                  Top Category
                </h3>
                <p className="text-xl font-bold text-purple-700 mt-2">
                  {summary.categories[0]?.name}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="p-6 bg-white rounded-2xl shadow-md text-center"
              >
                <BarIcon className="w-8 h-8 text-pink-500 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-800 mt-2">
                  Months Tracked
                </h3>
                <p className="text-2xl font-bold text-pink-700 mt-2">
                  {summary.monthly.length}
                </p>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {/* Monthly Trend (Bar Chart) */}
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Monthly Trend
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={summary.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#6366F1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Category Breakdown (Pie Chart) */}
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Category Breakdown
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={summary.categories}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {summary.categories.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-4 justify-center">
              <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow transition">
                <FileDown size={18} /> Export PDF
              </button>
              <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition">
                <FileDown size={18} /> Export Excel
              </button>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
