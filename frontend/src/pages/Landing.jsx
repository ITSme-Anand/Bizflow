import { Link } from "react-router-dom";

const features = [
  {
    title: "Sales Tracking",
    desc: "Record every sale and keep your revenue information organised in one place.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  {
    title: "Expense Control",
    desc: "Record business expenses and understand where your money is being spent.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Inventory Management",
    desc: "Monitor your stock and automatically reduce inventory when products are sold.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    title: "Business Analysis",
    desc: "See revenue, expenses, profit and inventory through a simple business overview.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: "One Connected System",
    desc: "Sales, expenses and inventory work together instead of being maintained separately.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
  },
  {
    title: "Access Anywhere",
    desc: "Access your business records from different devices using your personal account.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
];

const steps = [
  {
    num: "01",
    title: "Create Your Account",
    desc: "Sign up and create your business profile in seconds.",
  },
  {
    num: "02",
    title: "Record Transactions",
    desc: "Add your sales, expenses and inventory whenever your business operates.",
  },
  {
    num: "03",
    title: "Understand Your Business",
    desc: "Bizflow connects your records to give you a clearer picture of your business performance.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">
            Biz<span className="text-brand-500">flow</span>
          </div>

          <nav className="hidden sm:flex items-center gap-6">
            <a href="#features" className="text-sm text-surface-500 hover:text-surface-800 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-surface-500 hover:text-surface-800 transition-colors">
              How It Works
            </a>
            <Link to="/login" className="text-sm text-surface-500 hover:text-surface-800 transition-colors">
              Login
            </Link>
          </nav>

          <Link
            to="/signup"
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Hero Text */}
            <div className="flex-1 max-w-2xl animate-fade-in-up">
              <p className="text-brand-500 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-4">
                Smart Business Management
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Run Your Business{" "}
                <span className="text-brand-500">Smarter.</span>
              </h1>
              <p className="text-surface-500 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                Bizflow brings sales, expenses, inventory and business analysis
                together in one simple platform.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/signup"
                  className="px-6 py-3 text-sm font-medium text-white bg-brand-500 rounded-xl hover:bg-brand-600 transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
                <a
                  href="#features"
                  className="px-6 py-3 text-sm font-medium text-brand-600 bg-white border border-surface-200 rounded-xl hover:border-brand-200 hover:bg-brand-50 transition-all duration-200"
                >
                  Explore Features
                </a>
              </div>
            </div>

            {/* Preview Card */}
            <div className="w-full max-w-sm animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <div className="bg-white rounded-2xl p-8 shadow-elevated border border-surface-200/50">
                <p className="text-surface-400 text-xs tracking-widest uppercase mb-1">
                  Your Business Hub
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  All Your Business Data
                </h2>
                <p className="text-accent-500 text-sm font-medium mb-6">
                  Track • Manage • Analyse
                </p>
                <div className="flex gap-8">
                  {["Sales", "Expenses", "Inventory"].map((label, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-surface-800">{label}</span>
                      <span className="text-xs text-surface-400">
                        {["Track", "Control", "Manage"][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
          <div className="text-center mb-12 animate-fade-in-up">
            <p className="text-brand-500 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-4">
              Everything in One Place
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built for <span className="text-brand-500">Small Businesses</span>
            </h2>
            <p className="text-surface-500 text-base sm:text-lg max-w-2xl mx-auto">
              Replace scattered notebooks and separate records with one
              connected business management system.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 stagger">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-surface-200 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold mb-2">{f.title}</h3>
                <p className="text-surface-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
          <div className="text-center mb-12">
            <p className="text-brand-500 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-4">
              Simple Workflow
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              From Record to <span className="text-brand-500">Insight</span>
            </h2>
            <p className="text-surface-500 text-base sm:text-lg max-w-2xl mx-auto">
              Manage your business through a simple connected workflow.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-5 stagger">
            {steps.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-surface-200 shadow-card animate-fade-in-up"
              >
                <span className="text-brand-500 text-xs font-bold tracking-wider">{s.num}</span>
                <h3 className="text-base font-semibold mt-2 mb-2">{s.title}</h3>
                <p className="text-surface-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-surface-200 shadow-card text-center">
            <p className="text-brand-500 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-4">
              Ready to Get Started?
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Bring Your Business{" "}
              <span className="text-brand-500">Together.</span>
            </h2>
            <p className="text-surface-500 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Manage your business from one simple platform.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/signup"
                className="px-6 py-3 text-sm font-medium text-white bg-brand-500 rounded-xl hover:bg-brand-600 transition-all duration-200 shadow-sm hover:shadow-lg"
              >
                Create Your Account
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 text-sm font-medium text-brand-600 bg-white border border-surface-200 rounded-xl hover:border-brand-200 hover:bg-brand-50 transition-all duration-200"
              >
                Login
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
