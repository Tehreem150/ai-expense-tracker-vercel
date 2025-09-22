import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#9b59b6",
  "#e74c3c",
];

// ✅ Safe month abbreviations (no locale/timezone issues)
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await axios.get("/api/expenses/summary", {
        withCredentials: true,
      });
      setSummary(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        router.push("/login");
      } else {
        console.error("Error fetching summary:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (user) fetchSummary();
  }, [user, fetchSummary]);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10">
        Checking authentication...
      </p>
    );
  if (!user)
    return (
      <p className="text-center text-gray-500 mt-10">Redirecting to login...</p>
    );
  if (!summary)
    return (
      <p className="text-center text-gray-500 mt-10">Loading analytics...</p>
    );

  const totalSpent = summary.total || 0;
  const totalCategories = summary.categories?.length || 0;
  const highestCategory =
    summary.categories?.reduce(
      (max, item) => (item.value > max.value ? item : max),
      { name: "N/A", value: 0 }
    ) || {};

  let avgDaily = 0,
    avgWeekly = 0;
  if (summary.monthly?.length > 0) {
    const totalMonths = summary.monthly.length;
    const daysInMonths = totalMonths * 30;
    avgDaily = totalSpent / daysInMonths;
    avgWeekly = avgDaily * 7;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Analytics & Insights
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {[
          {
            title: "Total Spent",
            value: `$${totalSpent.toFixed(2)}`,
            color: "text-blue-600",
          },
          {
            title: "Categories",
            value: totalCategories,
            color: "text-green-600",
          },
          {
            title: "Top Category",
            value: `${highestCategory.name} ($${highestCategory.value?.toFixed(
              2
            )})`,
            color: "text-purple-600",
          },
          {
            title: "Avg Daily",
            value: `$${avgDaily.toFixed(2)}`,
            color: "text-orange-600",
          },
          {
            title: "Avg Weekly",
            value: `$${avgWeekly.toFixed(2)}`,
            color: "text-red-600",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white shadow rounded-2xl p-4 sm:p-6 text-center"
          >
            <h2 className="text-sm sm:text-base font-medium text-gray-600">
              {card.title}
            </h2>
            <p className={`text-lg sm:text-2xl font-bold ${card.color} mt-1`}>
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white shadow rounded-2xl p-4 sm:p-6"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Monthly Trend
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={summary.monthly || []}>
              <XAxis
                dataKey="month"
                tickFormatter={(dateStr) => {
                  const d = new Date(dateStr);
                  return MONTHS[d.getMonth()];
                }}
              />
              <YAxis />
              <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, "Total"]} />
              <Bar dataKey="total" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white shadow rounded-2xl p-4 sm:p-6"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Category Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={summary.categories || []}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
              >
                {summary.categories?.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, name) => [`$${v.toFixed(2)}`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* View Full Report Button */}
      <div className="flex justify-center mt-10">
        <motion.a
          href="/reports"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 
                     text-white font-semibold rounded-full shadow-lg 
                     hover:from-indigo-600 hover:to-purple-600 transition"
        >
          📊 View Full Report
        </motion.a>
      </div>
    </div>
  );
}
