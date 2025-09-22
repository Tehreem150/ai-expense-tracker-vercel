// pages/api/expenses/summary.js
import dbConnect from "../../../src/utils/db";
import Expense from "../../../src/models/Expense";
import { verifyToken } from "../../../src/utils/auth";

const ALLOWED_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "Other",
];

function normalizeCategory(cat) {
  if (!cat) return "Other";
  const cleaned = cat.toString().trim().toLowerCase();

  let match = ALLOWED_CATEGORIES.find((c) => c.toLowerCase() === cleaned);
  if (!match) {
    match = ALLOWED_CATEGORIES.find((c) => cleaned.startsWith(c.toLowerCase()));
  }
  if (!match) {
    match = ALLOWED_CATEGORIES.find((c) => cleaned.includes(c.toLowerCase()));
  }
  return match || "Other";
}

export default async function handler(req, res) {
  await dbConnect();

  const user = verifyToken(req);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  try {
    // 👇 log user id to confirm matching
    console.log("🔑 User from token:", user);

    // ⚠️ TEMP: remove filter if needed to debug
    // const expenses = await Expense.find();
    const expenses = await Expense.find({ user: user.id });

    console.log("📊 Found expenses:", expenses.length);

    const monthlyTrend = {};
    const categoryBreakdown = {};

    for (const exp of expenses) {
      // --- amount ---
      let amount = 0;
      if (typeof exp.amount === "number") {
        amount = exp.amount;
      } else {
        const cleaned = String(exp.amount).replace(/[^0-9.\-]+/g, "");
        amount = parseFloat(cleaned);
      }
      if (!isFinite(amount)) amount = 0;

      // --- month ---
      let monthKey = "unknown";
      if (exp.date) {
        const d = new Date(exp.date);
        if (!isNaN(d.getTime())) {
          monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            "0"
          )}-01`;
        }
      }
      monthlyTrend[monthKey] = (monthlyTrend[monthKey] || 0) + amount;

      // --- category ---
      const cat = normalizeCategory(exp.category);
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + amount;
    }

    // transform to arrays
    const monthly = Object.entries(monthlyTrend)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));

    const categories = ALLOWED_CATEGORIES.map((cat) => ({
      name: cat,
      value: categoryBreakdown[cat] || 0,
    })).sort((a, b) => b.value - a.value);

    const total = categories.reduce((s, c) => s + c.value, 0);

    res.json({ monthly, categories, total });
  } catch (err) {
    console.error("❌ Error generating summary:", err);
    res.status(500).json({ message: "Server error" });
  }
}
