// /pages/api/expenses/index.js
import dbConnect from "../../../src/utils/db";
import Expense from "../../../src/models/Expense";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  // ✅ extract token from cookie
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id; // 👈 this assumes your token payload has { id: user._id }
  } catch (err) {
    return res.status(401).json({ error: "Token is not valid" });
  }

  if (req.method === "GET") {
    try {
      const expenses = await Expense.find({ user: userId }).sort({
        createdAt: -1,
      });
      return res.status(200).json(expenses);
    } catch (error) {
      console.error("❌ Error fetching expenses:", error);
      return res.status(500).json({ error: "Failed to fetch expenses" });
    }
  }

  if (req.method === "POST") {
    try {
      const { title, amount, category, date, description } = req.body;

      if (!title || !amount || !date) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const expense = new Expense({
        title,
        amount,
        category: category || "Other",
        date,
        description: description || "",
        user: userId, // ✅ now taken from JWT
      });

      await expense.save();
      return res.status(201).json({ expense });
    } catch (error) {
      console.error("❌ Error saving expense:", error);
      return res.status(500).json({ error: "Failed to save expense" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
