import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ expense_name: "", amount: "" });

  const fetchExpenses = () => {
    api
      .get("/api/expenses")
      .then((res) => setExpenses(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/api/expenses", {
        expense_name: form.expense_name,
        amount: parseFloat(form.amount),
      });
      setForm({ expense_name: "", amount: "" });
      fetchExpenses();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <p className="text-brand-500 text-xs font-semibold tracking-widest uppercase mb-2">
          Expense Management
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold">
          Control Your <span className="text-brand-500">Expenses</span>
        </h1>
        <p className="text-surface-500 text-sm mt-2">
          Record and monitor your business spending in one place.
        </p>
      </div>

      {/* Add Expense Form */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-surface-200 shadow-card mb-6">
        <h3 className="text-base font-semibold mb-4">Add New Expense</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Expense Name
              </label>
              <input
                type="text"
                value={form.expense_name}
                onChange={(e) => setForm({ ...form, expense_name: e.target.value })}
                placeholder="Enter expense name"
                required
                className="w-full px-4 py-3 rounded-lg border border-surface-200 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Amount
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="Enter expense amount"
                min="0"
                step="0.01"
                required
                className="w-full px-4 py-3 rounded-lg border border-surface-200 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-sm hover:shadow-md"
          >
            {submitting ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-surface-200 shadow-card">
        <h3 className="text-base font-semibold mb-4">Recent Expenses</h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : expenses.length > 0 ? (
          <div className="divide-y divide-surface-100">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-sm">{expense.expense_name}</p>
                  <p className="text-surface-400 text-xs mt-0.5">Business expense</p>
                </div>
                <span className="text-danger font-bold text-sm">
                  ₹{parseFloat(expense.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-surface-400 text-sm py-4">
            No expenses recorded yet.
          </p>
        )}
      </div>
    </div>
  );
}
