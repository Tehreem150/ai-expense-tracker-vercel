// pages/expense-list.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { logoutUser } from "@/src/redux/authSlice";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import ExpenseList from "@/src/components/ExpenseList";

export default function ExpenseLists() {
  const [expenses, setExpenses] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

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
        } else {
          console.error("❌ Error fetching expenses:", error);
        }
      }
    }

    if (user) fetchExpenses();
  }, [user, dispatch, router]);

  // Handlers
  const handleExpenseDeleted = (id) =>
    setExpenses((prev) => prev.filter((e) => e._id !== id));

  const handleExpenseUpdated = (updatedExpense) =>
    setExpenses((prev) =>
      prev.map((e) => (e._id === updatedExpense._id ? updatedExpense : e))
    );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Expense List</h1>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <ExpenseList
            expenses={expenses}
            onExpenseDeleted={handleExpenseDeleted}
            onExpenseUpdated={handleExpenseUpdated}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
