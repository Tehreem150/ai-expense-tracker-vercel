import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // will link to User model later
      required: true,
    },
    title: {
      type: String,
      required: [true, "Expense title is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    category: {
      type: String,
      enum: ["Food", "Rent", "Travel", "Utilities", "Misc"],
      default: "Misc",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite in dev
export default mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);
