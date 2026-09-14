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
    <div className="auth-shell min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="auth-card surface-panel p-8 sm:p-10 shadow-elevated">
          {/* Logo */}
          <div className="text-2xl font-bold tracking-tight mb-1">
            Biz<span className="text-brand-500">flow</span>
          </div>

          <p className="eyebrow mt-8">Your business, in focus</p>
          <h1 className="font-[Space_Grotesk] text-2xl sm:text-3xl font-bold mb-2">Welcome back</h1>
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
              <label className="form-label">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="form-input"
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="primary-button accent-button w-full disabled:opacity-50"
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
