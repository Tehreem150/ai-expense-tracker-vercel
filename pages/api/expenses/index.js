import dbConnect from "../../../src/utils/db";
import Expense from "../../../src/models/Expense";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const expenses = await Expense.find().sort({ createdAt: -1 });
      return res.status(200).json(expenses);
    } catch (error) {
      console.error("❌ Error fetching expenses:", error);
      return res.status(500).json({ error: "Failed to fetch expenses" });
    }
  }

  if (req.method === "POST") {
    try {
      const { title, amount, category, date, description, user } = req.body;

      if (!title || !amount || !date) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const expense = new Expense({
        title,
        amount,
        category: category || "Other",
        date,
        description: description || "",
        user: user || "67a5f9f8e6a1a2c9d4f12345", // temp user
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
