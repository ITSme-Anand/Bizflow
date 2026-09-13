import { useEffect, useState } from "react";
import api from "../lib/api";

const UNITS = [
  "pieces", "kg", "g", "L", "ml", "m", "cm", "boxes", "packets", "bottles", "dozen",
];

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    product_name: "",
    quantity: "",
    unit: "pieces",
    amount: "",
  });

  const fetchSales = () => {
    api
      .get("/api/sales")
      .then((res) => setSales(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/api/sales", {
        product_name: form.product_name,
        quantity: parseFloat(form.quantity),
        unit: form.unit,
        amount: parseFloat(form.amount),
      });
      setForm({ product_name: "", quantity: "", unit: "pieces", amount: "" });
      fetchSales();
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
          Sales Management
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold">
          Track Your <span className="text-brand-500">Sales</span>
        </h1>
        <p className="text-surface-500 text-sm mt-2">
          Record and monitor your business sales in one place.
        </p>
      </div>

      {/* Add Sale Form */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-surface-200 shadow-card mb-6">
        <h3 className="text-base font-semibold mb-4">Add New Sale</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Product Name
              </label>
              <input
                type="text"
                value={form.product_name}
                onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                placeholder="Enter product name"
                required
                className="w-full px-4 py-3 rounded-lg border border-surface-200 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Quantity
              </label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="Enter quantity"
                min="0"
                step="0.01"
                required
                className="w-full px-4 py-3 rounded-lg border border-surface-200 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Unit
              </label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-surface-200 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u.charAt(0).toUpperCase() + u.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Total Amount
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="Enter total sale amount"
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
            {submitting ? "Adding..." : "Add Sale"}
          </button>
        </form>
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-surface-200 shadow-card">
        <h3 className="text-base font-semibold mb-4">Recent Sales</h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sales.length > 0 ? (
          <div className="divide-y divide-surface-100">
            {sales.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-sm">{sale.product_name}</p>
                  <p className="text-surface-400 text-xs mt-0.5">
                    Quantity: {sale.quantity} {sale.unit}
                  </p>
                </div>
                <span className="text-accent-500 font-bold text-sm">
                  ₹{parseFloat(sale.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-surface-400 text-sm py-4">No sales recorded yet.</p>
        )}
      </div>
    </div>
  );
}
