import { useEffect, useState } from "react";
import api from "../lib/api";

const UNITS = [
  "pieces", "kg", "g", "L", "ml", "m", "cm", "boxes", "packets", "bottles", "dozen",
];

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    product_name: "",
    quantity: "",
    unit: "pieces",
    price: "",
  });

  const fetchInventory = () => {
    api
      .get("/api/inventory")
      .then((res) => setInventory(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/api/inventory", {
        product_name: form.product_name,
        quantity: parseFloat(form.quantity),
        unit: form.unit,
        price: parseFloat(form.price),
      });
      setForm({ product_name: "", quantity: "", unit: "pieces", price: "" });
      fetchInventory();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuantityChange = async (id, action) => {
    try {
      await api.patch(`/api/inventory/${id}/${action}`);
      fetchInventory();
    } catch (err) {
      console.error(err);
    }
  };

  const getStockBadge = (qty) => {
    const q = parseFloat(qty);
    if (q === 0) {
      return (
        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-danger">
          Out of Stock
        </span>
      );
    }
    if (q <= 5) {
      return (
        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-warning">
          Low Stock
        </span>
      );
    }
    return (
      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-success">
        In Stock
      </span>
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <p className="text-brand-500 text-xs font-semibold tracking-widest uppercase mb-2">
          Inventory Management
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold">
          Manage Your <span className="text-brand-500">Inventory</span>
        </h1>
        <p className="text-surface-500 text-sm mt-2">
          Keep track of your products, stock quantities, units and prices in one place.
        </p>
      </div>

      {/* Add Product Form */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-surface-200 shadow-card mb-6">
        <h3 className="text-base font-semibold mb-4">Add New Product</h3>

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
                placeholder="Enter stock quantity"
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
                Price Per Item
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Enter price"
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
            {submitting ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>

      {/* Inventory List */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-surface-200 shadow-card">
        <h3 className="text-base font-semibold mb-4">Current Inventory</h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : inventory.length > 0 ? (
          <div className="divide-y divide-surface-100">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-4 first:pt-0 last:pb-0 gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm">{item.product_name}</p>
                  <p className="text-surface-400 text-xs mt-0.5">
                    Stock: {item.quantity} {item.unit}
                  </p>
                  <div className="mt-1.5">{getStockBadge(item.quantity)}</div>
                  <p className="text-surface-400 text-xs mt-1">
                    ₹{parseFloat(item.price).toFixed(2)} per {item.unit}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleQuantityChange(item.id, "decrease")}
                    className="w-9 h-9 rounded-lg bg-accent-500 text-white text-lg font-bold hover:bg-accent-600 transition-all cursor-pointer flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="w-9 text-center text-sm font-bold">
                    {parseFloat(item.quantity)}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id, "increase")}
                    className="w-9 h-9 rounded-lg bg-accent-500 text-white text-lg font-bold hover:bg-accent-600 transition-all cursor-pointer flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-surface-400 text-sm py-4">No products added yet.</p>
        )}
      </div>
    </div>
  );
}
