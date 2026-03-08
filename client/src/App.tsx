import { Link, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import Dashboard from "./medicine/Dashboard";
import Medicine from "./medicine/Medicine";
import MedicineLists from "./medicine/MedicineLists";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <header className="w-full bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <h1 className="font-black text-green-600 text-sm md:text-lg lg:text-xl">MediSync</h1>
            <nav className="flex bg-slate-100 p-1 rounded-xl">
              <NavLink to="/" label="Dashboard" />
              <NavLink to="/medicines" label="Medicines" />
            </nav>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/medicines" element={<MedicineLists />} />
            <Route path="/medicines/:id" element={<Medicine />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function NavLink({ to, label }: { to: string; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`lg:px-6 lg:py-2 px-2 py-1 md:px-4  font-semibold rounded-lg transition-all text-sm ${isActive
        ? "bg-white text-green-600 shadow-sm"
        : "text-slate-500 hover:text-slate-700"
        }`}
    >
      {label}
    </Link>
  )
}

export default App