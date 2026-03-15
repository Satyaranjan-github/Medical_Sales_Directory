import { LayoutDashboard, Pill, Settings, Tag, type LucideIcon } from "lucide-react";
import { NavLink, Route, Routes } from "react-router-dom";
import BrandLists from "./brand/components/BrandLists";
import Dashboard from "./common/Dashboard";
import Navbar from "./common/Navbar";
import Medicine from "./medicine/components/Medicine";
import MedicineLists from "./medicine/components/MedicineLists";

export const Layout = () => {
    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900">
            {/* 1. SIDEBAR */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="font-black text-green-600 text-xl tracking-tight">MediSync</h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <SidebarLink to="/" label="Dashboard" Icon={LayoutDashboard} />
                    <SidebarLink to="/medicines" label="Medicines" Icon={Pill} />
                    <SidebarLink to="/brands" label="Brands" Icon={Tag} />
                    <SidebarLink to="/settings" label="Settings" Icon={Settings} />
                </nav>

                <div className="p-4 border-t border-slate-100 text-xs text-slate-400">
                    v1.0.2 AR Robotics India
                </div>
            </aside>

            {/* 2. MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col">
                <Navbar />
                <div>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/medicines" element={<MedicineLists />} />
                        <Route path="/medicines/:id" element={<Medicine />} />
                        <Route path="/brands" element={<BrandLists />} />
                    </Routes>
                </div>
            </div>
        </div >
    );
};

// Helper Component for Sidebar Links
const SidebarLink = ({ to, label, Icon }: { to: string, label: string, Icon: LucideIcon }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                ? "bg-green-50 text-green-700 font-semibold border-r-4 border-green-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`
        }
    >
        <Icon size={20} />
        {label}
    </NavLink>
);