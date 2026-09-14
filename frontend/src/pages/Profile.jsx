import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Profile() {
  const { user } = useAuth();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/api/profile").then((response) => setProfile(response.data)).catch(console.error);
  }, []);

  const businessName = profile?.business_name || user?.user_metadata?.business_name || "Your business";
  const email = profile?.email || user?.email || "Not available";
  const joined = profile?.created_at ? new Date(profile.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "Recently joined";
  const handleLogout = async () => { await signOut(); navigate("/login"); };

  return (
    <div className="animate-fade-in">
      <div className="page-heading">
        <div><p className="eyebrow">Account</p><h1>Your profile</h1><p>Keep your business identity close while you manage the day.</p></div>
      </div>
      <div className="grid gap-5 md:grid-cols-[260px_1fr]">
        <section className="surface-panel p-7 text-center">
          <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-accent-100 text-3xl font-bold text-accent-700">{businessName.charAt(0).toUpperCase()}</div>
          <h2 className="font-semibold text-surface-800">{businessName}</h2>
          <p className="mt-1 text-xs text-surface-400">Bizflow account</p>
        </section>
        <section className="surface-panel p-6 sm:p-8">
          <div className="section-title"><h2>Account details</h2><span>Active profile</span></div>
          <dl className="divide-y divide-surface-100">
            <div className="py-4"><dt className="form-label">Business name</dt><dd className="text-sm font-semibold text-surface-800">{businessName}</dd></div>
            <div className="py-4"><dt className="form-label">Email address</dt><dd className="text-sm font-semibold text-surface-800">{email}</dd></div>
            <div className="py-4"><dt className="form-label">Member since</dt><dd className="text-sm font-semibold text-surface-800">{joined}</dd></div>
          </dl>
          <div className="mt-5 flex flex-wrap gap-3"><Link to="/dashboard" className="primary-button">Back to dashboard</Link><button type="button" onClick={handleLogout} className="primary-button bg-danger hover:bg-danger">Logout</button></div>
        </section>
      </div>
    </div>
  );
}