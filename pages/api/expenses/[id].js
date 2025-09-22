import dbConnect from "../../../src/utils/db";
import Expense from "../../../src/models/Expense";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  // ✅ Verify JWT from cookies
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    // 🔹 DELETE an expense
    if (req.method === "DELETE") {
      const deleted = await Expense.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: "Expense not found" });
      }
      return res.status(200).json({ message: "Expense deleted" });
    }

    // 🔹 UPDATE an expense
    if (req.method === "PUT") {
      const { title, amount, category, date } = req.body;

      const updated = await Expense.findByIdAndUpdate(
        id,
        { title, amount, category, date },
        { new: true } // return updated doc
      );

      if (!updated) {
        return res.status(404).json({ message: "Expense not found" });
      }

      return res.status(200).json(updated);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
