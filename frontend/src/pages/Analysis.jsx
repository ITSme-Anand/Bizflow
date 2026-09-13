import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function Analysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/analysis")
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-7 h-7 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${data?.total_sales?.toFixed(2) ?? "0.00"}`,
      sub: "From recorded sales",
    },
    {
      label: "Total Expenses",
      value: `₹${data?.total_expenses?.toFixed(2) ?? "0.00"}`,
      sub: "Business spending",
    },
    {
      label: "Net Profit",
      value: `₹${data?.profit?.toFixed(2) ?? "0.00"}`,
      sub: "Revenue − expenses",
    },
    {
      label: "Products",
      value: data?.inventory_count ?? 0,
      sub: "In inventory",
    },
  ];

  const getProfitMessage = () => {
    if (data?.profit > 0)
      return "Your recorded revenue is currently higher than your recorded expenses.";
    if (data?.profit < 0)
      return "Your recorded expenses are currently higher than your recorded revenue.";
    return "Your revenue and expenses are currently equal.";
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <p className="text-brand-500 text-xs font-semibold tracking-widest uppercase mb-2">
          Business Analysis
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold">
          Understand Your <span className="text-brand-500">Business</span>
        </h1>
        <p className="text-surface-500 text-sm mt-2">
          Turn your business records into simple and useful insights.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-5 border border-surface-200 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up"
          >
            <p className="text-surface-500 text-sm mb-2">{s.label}</p>
            <p className="text-2xl font-bold text-accent-500">{s.value}</p>
            <p className="text-surface-400 text-xs mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Detail Cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-surface-200 shadow-card">
          <h3 className="text-base font-semibold mb-3">Revenue Overview</h3>
          <p className="text-2xl font-bold text-accent-500 mb-2">
            ₹{data?.total_sales?.toFixed(2) ?? "0.00"}
          </p>
          <p className="text-surface-400 text-sm">
            This is the total revenue generated from all sales recorded in Bizflow.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-surface-200 shadow-card">
          <h3 className="text-base font-semibold mb-3">Expense Overview</h3>
          <p className="text-2xl font-bold text-danger mb-2">
            ₹{data?.total_expenses?.toFixed(2) ?? "0.00"}
          </p>
          <p className="text-surface-400 text-sm">
            This represents the total amount spent on recorded business expenses.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-surface-200 shadow-card">
          <h3 className="text-base font-semibold mb-3">Profitability</h3>
          <p className={`text-2xl font-bold mb-2 ${data?.profit >= 0 ? "text-success" : "text-danger"}`}>
            ₹{data?.profit?.toFixed(2) ?? "0.00"}
          </p>
          <p className="text-surface-400 text-sm">{getProfitMessage()}</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-surface-200 shadow-card">
          <h3 className="text-base font-semibold mb-3">Inventory Status</h3>
          <p className="text-2xl font-bold text-brand-500 mb-2">
            {data?.inventory_count ?? 0}
          </p>
          <p className="text-surface-400 text-sm">
            Different products currently recorded in your inventory.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-surface-200 shadow-card">
        <h3 className="text-base font-semibold mb-2">Keep Your Business Updated</h3>
        <p className="text-surface-400 text-sm mb-4">
          Regularly update your sales, expenses and inventory to keep your business analysis accurate.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/sales"
            className="px-5 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-all"
          >
            Add Sale
          </Link>
          <Link
            to="/expenses"
            className="px-5 py-2.5 text-sm font-medium text-brand-600 border border-surface-200 rounded-lg hover:border-brand-200 hover:bg-brand-50 transition-all"
          >
            Add Expense
          </Link>
          <Link
            to="/inventory"
            className="px-5 py-2.5 text-sm font-medium text-brand-600 border border-surface-200 rounded-lg hover:border-brand-200 hover:bg-brand-50 transition-all"
          >
            Manage Inventory
          </Link>
        </div>
      </div>
    </div>
  );
}
