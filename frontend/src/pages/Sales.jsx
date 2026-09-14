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
      <div className="page-heading">
        <div><p className="eyebrow">
          Sales Management
        </p><h1>Track your sales.</h1><p>
          Record and monitor your business sales in one place.
        </p></div>
      </div>

      {/* Add Sale Form */}
      <div className="form-panel surface-panel mb-6">
        <h2>Add New Sale</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                Product Name
              </label>
              <input
                type="text"
                value={form.product_name}
                onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                placeholder="Enter product name"
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">
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
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">
                Unit
              </label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                required
                className="form-input"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u.charAt(0).toUpperCase() + u.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">
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
                className="form-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="primary-button accent-button w-full sm:w-auto"
          >
            {submitting ? "Adding..." : "Add Sale"}
          </button>
        </form>
      </div>

      {/* Sales List */}
      <div className="surface-panel p-5 sm:p-6">
        <div className="section-title"><h2>Recent Sales</h2><span>Newest first</span></div>

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
                    {sale.sale_date ? new Date(sale.sale_date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "Date unavailable"} · Quantity: {sale.quantity} {sale.unit}
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
