import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/dashboard")
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
      label: "Total Sales",
      value: `₹${data?.total_sales?.toFixed(2) ?? "0.00"}`,
      sub: "Revenue generated",
      color: "text-accent-500",
    },
    {
      label: "Total Expenses",
      value: `₹${data?.total_expenses?.toFixed(2) ?? "0.00"}`,
      sub: "Business spending",
      color: "text-danger",
    },
    {
      label: "Net Profit",
      value: `₹${data?.profit?.toFixed(2) ?? "0.00"}`,
      sub: "Sales − Expenses",
      color: data?.profit >= 0 ? "text-success" : "text-danger",
    },
    {
      label: "Inventory Items",
      value: data?.inventory_count ?? 0,
      sub: "Products recorded",
      color: "text-brand-500",
    },
  ];

  const quickActions = [
    { label: "+ Add Sale", to: "/sales" },
    { label: "+ Add Expense", to: "/expenses" },
    { label: "+ Add Product", to: "/inventory" },
    { label: "View Analysis", to: "/analysis" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-brand-500 text-xs font-semibold tracking-widest uppercase mb-2">
          Business Dashboard
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome to your <span className="text-brand-500">Dashboard</span>
        </h1>
        <p className="text-surface-500 text-sm mt-2 max-w-xl">
          Manage your sales, expenses, inventory and business performance from one place.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-5 border border-surface-200 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up"
          >
            <p className="text-surface-500 text-sm mb-2">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-surface-400 text-xs mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-5 border border-surface-200 shadow-card mb-6">
        <h3 className="text-base font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((a, i) => (
            <Link
              key={i}
              to={a.to}
              className="px-4 py-3 text-sm text-center font-medium rounded-lg border border-surface-200 bg-surface-50 hover:bg-accent-50 hover:border-accent-300 hover:text-accent-600 transition-all duration-200"
            >
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-surface-200 shadow-card">
          <h3 className="text-base font-semibold mb-3">Business Performance</h3>
          {data?.total_sales > 0 ? (
            <>
              <p className="text-surface-500 text-sm leading-relaxed">
                Your business has recorded{" "}
                <span className="font-semibold text-surface-800">
                  ₹{data.total_sales.toFixed(2)}
                </span>{" "}
                in sales so far.
              </p>
              <p className="text-surface-500 text-sm leading-relaxed mt-2">
                After expenses, your current profit is{" "}
                <span className="font-semibold text-surface-800">
                  ₹{data.profit.toFixed(2)}
                </span>
                .
              </p>
            </>
          ) : (
            <p className="text-surface-400 text-sm">
              Start recording your sales and expenses to see your business
              performance here.
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl p-5 border border-surface-200 shadow-card">
          <h3 className="text-base font-semibold mb-3">Inventory Overview</h3>
          {data?.inventory_count > 0 ? (
            <>
              <p className="text-surface-500 text-sm leading-relaxed">
                You currently have{" "}
                <span className="font-semibold text-surface-800">
                  {data.inventory_count}
                </span>{" "}
                product(s) recorded in your inventory.
              </p>
              <Link
                to="/inventory"
                className="inline-block mt-3 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-all"
              >
                Manage Inventory
              </Link>
            </>
          ) : (
            <>
              <p className="text-surface-400 text-sm">
                No products have been added yet.
              </p>
              <Link
                to="/inventory"
                className="inline-block mt-3 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-all"
              >
                Add Your First Product
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
