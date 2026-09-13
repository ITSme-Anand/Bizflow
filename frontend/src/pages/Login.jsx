import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-elevated border border-surface-200/50">
          {/* Logo */}
          <div className="text-2xl font-bold tracking-tight mb-1">
            Biz<span className="text-brand-500">flow</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mt-6 mb-2">Welcome Back</h1>
          <p className="text-surface-500 text-sm mb-8">
            Login to manage your business.
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 text-danger text-sm border border-red-100 animate-slide-down">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-lg border border-surface-200 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 rounded-lg border border-surface-200 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-sm hover:shadow-md"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-surface-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-accent-500 font-semibold hover:text-accent-600 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
