import dbConnect from "../../../src/utils/db";
import Expense from "../../../src/models/Expense";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await dbConnect();
    const expense = await Expense.create(req.body);
    return res.status(201).json({ expense });
  }
  res.status(405).json({ message: "Method not allowed" });
}
