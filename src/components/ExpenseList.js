import { useState } from "react";
import axios from "axios";

const categoryIcons = {
  Food: "🍔",
  Transport: "🚗",
  Shopping: "🛍️",
  Bills: "💡",
  Other: "🏷️",
};

export default function ExpenseList({
  expenses = [], // ✅ default empty array
  onExpenseDeleted,
  onExpenseUpdated,
}) {
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  // ✅ fallback to 0 if no expenses
  const total = expenses.length
    ? expenses.reduce((acc, exp) => acc + Number(exp.amount || 0), 0)
    : 0;

  if (!expenses || expenses.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-white/70 backdrop-blur-md border border-gray-200 text-center shadow">
        <p className="text-gray-500">
          No expenses yet. Start by adding one above 📤
        </p>
      </div>
    );
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/expenses/${id}`, { withCredentials: true });
      if (onExpenseDeleted) onExpenseDeleted(id);
    } catch (error) {
      console.error("Error deleting expense", error);
    }
  };

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date?.split("T")[0] || "", // ✅ safe split
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/expenses/${editingExpense._id}`,
        formData,
        { withCredentials: true }
      );
      if (onExpenseUpdated) onExpenseUpdated(data);
      setEditingExpense(null);
    } catch (error) {
      console.error("Error updating expense", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Smart Categorization Info */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800">
        <h3 className="font-semibold mb-1">🏷️ Smart Categorization</h3>
        <p className="text-sm leading-relaxed text-gray-700">
          Our <span className="font-medium">AI</span> automatically categorizes
          your expenses, making it easy to understand where your money goes.
          <br /> No more manual sorting — just focus on your spending insights.
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-xl shadow">
        <table className="w-full border-collapse">
          <thead className="bg-indigo-500 text-white sticky top-0">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {expenses.map((exp, idx) => (
              <tr
                key={exp._id}
                className={`border-b last:border-0 ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-indigo-50 transition`}
              >
                <td className="p-3 font-medium text-gray-800">{exp.title}</td>
                <td className="p-3 text-gray-700">${exp.amount}</td>
                <td className="p-3 flex items-center gap-2">
                  <span>{categoryIcons[exp.category] || "🏷️"}</span>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                    {exp.category}
                  </span>
                </td>
                <td className="p-3 text-gray-600">
                  {exp.date ? new Date(exp.date).toLocaleDateString() : "N/A"}
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEditClick(exp)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Sticky Header + Cards */}
      <div className="md:hidden">
        <div className="sticky top-0 z-10 bg-indigo-600 text-white p-3 rounded-b-lg shadow-md flex justify-between items-center">
          <span className="font-medium">Total Spent</span>
          <span className="font-bold text-lg">${total}</span>
        </div>

        <div className="space-y-4 mt-4">
          {expenses.map((exp) => (
            <div
              key={exp._id}
              className="p-4 rounded-xl shadow border border-gray-200 bg-white space-y-2"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  {categoryIcons[exp.category] || "🏷️"} {exp.title}
                </h4>
                <span className="font-bold text-indigo-600">${exp.amount}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                  {exp.category}
                </span>
                <span>
                  {exp.date ? new Date(exp.date).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => handleEditClick(exp)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingExpense && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-11/12 md:w-96">
            <h2 className="text-xl font-bold mb-4">Edit Expense</h2>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingExpense(null)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
