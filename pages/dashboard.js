// pages/dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../src/redux/authSlice";
import { useRouter } from "next/router";
import ProtectedRoute from "../src/components/ProtectedRoute";
import ExpenseForm from "../src/components/ExpenseForm";
import ExpenseList from "../src/components/ExpenseList";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Upload,
  Scan,
  BarChart,
  DollarSign,
  PieChart,
  FileText,
  Calendar,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) router.push("/login");

    async function fetchExpenses() {
      try {
        const res = await axios.get("/api/expenses", { withCredentials: true });
        setExpenses(res.data);
      } catch (error) {
        if (error.response?.status === 401) {
          dispatch(logoutUser());
          router.push("/login");
        } else console.error(error);
      }
    }
    if (user) fetchExpenses();
  }, [user, dispatch, router]);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => router.push("/login"));
  };

  const handleExpenseAdded = (newExpense) =>
    setExpenses((prev) => [newExpense, ...prev]);
  const handleExpenseDeleted = (id) =>
    setExpenses((prev) => prev.filter((e) => e._id !== id));
  const handleExpenseUpdated = (updatedExpense) =>
    setExpenses((prev) =>
      prev.map((e) => (e._id === updatedExpense._id ? updatedExpense : e))
    );

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categoryMap = {};
  expenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });
  const topCategory = Object.keys(categoryMap).reduce(
    (a, b) => (categoryMap[a] > categoryMap[b] ? a : b),
    Object.keys(categoryMap)[0] || "N/A"
  );
  // Calculate days tracked (based on first and last expense date)
  let daysTracked = 1;
  if (expenses.length > 0) {
    const sortedByDate = [...expenses].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const firstDate = new Date(sortedByDate[0].date);
    const lastDate = new Date(sortedByDate[sortedByDate.length - 1].date);

    // +1 so if same day it doesn’t become 0
    daysTracked = Math.max(
      1,
      Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24))
    );
  }

  // Calculate monthly expenses (sum for current month)
  const now = new Date();
  const monthlyExpenses = expenses
    .filter(
      (e) =>
        new Date(e.date).getMonth() === now.getMonth() &&
        new Date(e.date).getFullYear() === now.getFullYear()
    )
    .reduce((sum, e) => sum + e.amount, 0);

  // Calculate last month's expenses
  const lastMonthExpenses = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return (
        d.getMonth() === now.getMonth() - 1 &&
        d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, e) => sum + e.amount, 0);

  // Compare this month vs last month
  let monthComparison = null;
  if (lastMonthExpenses > 0) {
    const diff = monthlyExpenses - lastMonthExpenses;
    const percentChange = ((diff / lastMonthExpenses) * 100).toFixed(1);
    monthComparison = { diff, percentChange };
  }
  // card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-white drop-shadow">
              Dashboard
            </h1>
            <p className="text-gray-100">Welcome back, {user?.name} 🚀</p>
          </div>
          <div className="flex gap-3">
            <Link href="/analytics">
              <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-2 rounded-lg transition font-medium shadow">
                View Analytics
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg transition shadow"
            >
              Logout
            </button>
          </div>
        </div>

        {/* How It Works (6 Steps in 2 Rows with Row-by-Row Animation) */}
        <section className="py-12 relative">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            How It Works
          </h2>

          <motion.div
            className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.2, // stagger between cards
                  delayChildren: 0.3, // wait before starting second row
                },
              },
            }}
          >
            {[
              {
                step: 1,
                title: "Upload Receipt",
                desc: "Snap or upload your receipt to get started.",
                icon: <Upload className="w-10 h-10 text-indigo-500 mb-3" />,
              },
              {
                step: 2,
                title: "AI Scans It",
                desc: "Our AI extracts details instantly, no typing needed.",
                icon: <Scan className="w-10 h-10 text-purple-500 mb-3" />,
              },
              {
                step: 3,
                title: "Auto Categorization",
                desc: "Expenses are sorted into categories automatically.",
                icon: <PieChart className="w-10 h-10 text-green-500 mb-3" />,
              },
              {
                step: 4,
                title: "Get Insights",
                desc: "See trends, top categories, and smart analytics.",
                icon: <BarChart className="w-10 h-10 text-blue-500 mb-3" />,
              },
              {
                step: 5,
                title: "Track Spending",
                desc: "Stay in control of your money with real-time updates.",
                icon: <DollarSign className="w-10 h-10 text-rose-500 mb-3" />,
              },
              {
                step: 6,
                title: "Download Reports",
                desc: "Export your expenses as PDF or Excel for sharing.",
                icon: <FileText className="w-10 h-10 text-orange-500 mb-3" />,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.03 }}
                className="relative p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition text-center flex flex-col items-center"
              >
                {/* Step Badge */}
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-2">
                  Step {item.step} of 6
                </span>

                {item.icon}
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Dashboard Summary */}
        <section className="py-10">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Dashboard Summary
          </h2>

          {/* Row 1 */}
          <motion.div
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-6"
          >
            {/* Total Expenses */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition text-center"
            >
              <DollarSign className="w-8 h-8 text-indigo-500 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-800 mt-2">
                Total Expenses
              </h3>
              <p className="text-2xl font-bold text-indigo-700 mt-2">
                ${totalExpenses.toFixed(2)}
              </p>
            </motion.div>

            {/* Daily Average */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition text-center"
            >
              <Calendar className="w-8 h-8 text-teal-500 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-800 mt-2">
                Daily Average
              </h3>
              <p className="text-2xl font-bold text-teal-700 mt-2">
                ${(totalExpenses / daysTracked).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                over {daysTracked} days
              </p>
            </motion.div>

            {/* Monthly Expenses */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition text-center"
            >
              <CalendarDays className="w-8 h-8 text-pink-500 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-800 mt-2">
                Monthly Expenses
              </h3>
              <p className="text-2xl font-bold text-pink-700 mt-2">
                ${monthlyExpenses.toFixed(2)}
              </p>
            </motion.div>
          </motion.div>

          {/* Row 2 */}
          <motion.div
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {/* Top Category */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition text-center"
            >
              <PieChart className="w-8 h-8 text-purple-500 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-800 mt-2">
                Top Category
              </h3>
              <p className="text-xl font-bold text-purple-700 mt-2">
                {topCategory}
              </p>
              {expenses.length > 0 && (
                <div className="w-full mt-4 bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-purple-400 rounded-full"
                    style={{
                      width: `${
                        ((categoryMap[topCategory] || 0) / totalExpenses) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              )}
              <p className="text-gray-500 text-sm mt-2">
                {totalExpenses > 0
                  ? `${(
                      ((categoryMap[topCategory] || 0) / totalExpenses) *
                      100
                    ).toFixed(1)}% of total`
                  : "No expenses yet"}
              </p>
            </motion.div>

            {/* Top Expense */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition text-center"
            >
              <TrendingUp className="w-8 h-8 text-orange-500 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-800 mt-2">
                Top Expense
              </h3>
              {expenses.length > 0 ? (
                <p className="text-2xl font-bold text-orange-700 mt-2">
                  ${Math.max(...expenses.map((e) => e.amount)).toFixed(2)}
                </p>
              ) : (
                <p className="text-gray-500 mt-2 text-sm">No expenses yet</p>
              )}
            </motion.div>

            {/* Receipts Uploaded */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition text-center"
            >
              <FileText className="w-8 h-8 text-green-500 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-800 mt-2">
                Receipts Uploaded
              </h3>
              <p className="text-2xl font-bold text-green-700 mt-2">
                {expenses.length}
              </p>
            </motion.div>
          </motion.div>

          {/* Highlight row - Month Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6"
          >
            <div className="p-6 bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl shadow-md text-center">
              <TrendingUp className="w-8 h-8 text-orange-600 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-800 mt-2">
                Month Comparison
              </h3>
              {monthComparison ? (
                <>
                  <p className="text-2xl font-bold mt-2">
                    {monthComparison.diff >= 0 ? "+" : ""}
                    {monthComparison.percentChange}%{" "}
                    <span
                      className={`inline-block ${
                        monthComparison.diff >= 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {monthComparison.diff >= 0 ? "↑" : "↓"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    vs last month (${lastMonthExpenses.toFixed(2)})
                  </p>
                </>
              ) : (
                <p className="text-gray-600 mt-2 text-sm">
                  No data for last month
                </p>
              )}
            </div>
          </motion.div>
        </section>

        {/* Expense Form + List */}
    
      </div>
    </ProtectedRoute>
  );
}
