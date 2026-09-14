import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const { error: authError } = await signUp(email, password, businessName);

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    navigate("/login");
  };

  return (
    <div className="auth-shell min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="auth-card surface-panel p-8 sm:p-10 shadow-elevated">
          {/* Logo */}
          <div className="text-2xl font-bold tracking-tight mb-1">
            Biz<span className="text-brand-500">flow</span>
          </div>

          <p className="eyebrow mt-8">A sharper start</p>
          <h1 className="font-[Space_Grotesk] text-2xl sm:text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-surface-500 text-sm mb-8">
            Set up your business on Bizflow.
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 text-danger text-sm border border-red-100 animate-slide-down">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">
                Business Name
              </label>
              <input
                id="signup-business-name"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter your business name"
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">
                Email
              </label>
              <input
                id="signup-email"
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
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">
                Confirm Password
              </label>
              <input
                id="signup-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                className="form-input"
              />
            </div>

            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="primary-button accent-button w-full disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-surface-500">
            Already have an account?{" "}
            <Link to="/login" className="text-accent-500 font-semibold hover:text-accent-600 transition-colors">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
