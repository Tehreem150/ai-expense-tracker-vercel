import ExpenseForm from "@/src/components/ExpenseForm";

export default function AddExpense() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Add Expense</h1>
      <p className="text-gray-600">
        <ExpenseForm />
      </p>
    </div>
  );
}
