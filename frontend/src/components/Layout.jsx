import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/sales", label: "Sales" },
  { to: "/inventory", label: "Inventory" },
  { to: "/expenses", label: "Expenses & Costs" },
  { to: "/analysis", label: "Analysis" },
];

export default function Layout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="app-shell min-h-screen">
      {/* Header */}
      <header className="site-header sticky top-0 z-50 bg-white/85 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="brand-mark"><span>Bizflow</span></Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? "bg-brand-50 text-brand-600"
                    : "text-surface-500 hover:text-surface-800 hover:bg-surface-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Logout */}
          <Link to="/profile" className="profile-link hidden md:inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-surface-600 hover:text-brand-600 transition-colors">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-accent-100 text-accent-700">P</span>
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="hidden md:inline-flex items-center px-4 py-2 text-sm font-bold text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50 transition-all duration-200 cursor-pointer"
          >
            Logout
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-surface-600 hover:bg-surface-100 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-surface-200 bg-white animate-slide-down">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                      ? "bg-brand-50 text-brand-600"
                      : "text-surface-600 hover:bg-surface-100"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-red-50 transition-all cursor-pointer"
              >
                Logout
              </button>
              <NavLink to="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-100">
                Profile
              </NavLink>
            </div>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
