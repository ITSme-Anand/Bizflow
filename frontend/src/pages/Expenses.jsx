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
      <div className="page-heading">
        <div><p className="eyebrow">
          Expense/Cost Management
        </p><h1>Keep spending in view.</h1><p>
          Record and monitor your business spending in one place.
        </p></div>
      </div>

      {/* Add Expense Form */}
      <div className="form-panel surface-panel mb-6"><h2>Add New Expense/Cost</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                Expense/Cost Name
              </label>
              <input
                type="text"
                value={form.expense_name}
                onChange={(e) => setForm({ ...form, expense_name: e.target.value })}
                placeholder="Enter expense/cost name"
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">
                Amount
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="Enter expense/cost amount"
                min="0"
                step="0.01"
                required
                className="form-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="primary-button accent-button w-full sm:w-auto"
          >
            {submitting ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </div>

      {/* Expenses List */}
      <div className="surface-panel p-5 sm:p-6"><div className="section-title"><h2>Recent Expenses/Costs</h2><span>Newest first</span></div>

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
                  <p className="text-surface-400 text-xs mt-0.5">{expense.expense_date ? new Date(expense.expense_date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "Date unavailable"} · Business expense</p>
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
