import {
    Layers,
    LayoutDashboard,
    Pill,
    Settings as SettingsIcon,
    ShoppingBag,
    Tag,
    X,
    type LucideIcon
} from "lucide-react";
import { useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import Brand from "./brand/components/Brand";
import BrandLists from "./brand/components/BrandLists";
import Category from "./category/components/Category";
import CategoryLists from "./category/components/CategoryLists";
import Dashboard from "./common/Dashboard";
import Navbar from "./common/Navbar";
import Medicine from "./medicine/components/Medicine";
import MedicineLists from "./medicine/components/MedicineLists";
import Settings from "./settings/Settings";
import { ThemeProvider } from "./context/ThemeContext";

export const Layout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <ThemeProvider>
            <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
                {/* MOBILE DRAWER OVERLAY BACKDROP */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
                        onClick={closeMobileMenu}
                    />
                )}

                {/* MOBILE SIDEBAR DRAWER (Slide in from left on mobile) */}
                <aside
                    className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 z-50 transform transition-transform duration-300 md:hidden flex flex-col shadow-2xl ${
                        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-green-600 text-white shadow-md shadow-green-600/20">
                                <Pill size={22} className="rotate-45" />
                            </div>
                            <div>
                                <h1 className="font-black text-slate-900 dark:text-white text-lg tracking-tight leading-none">
                                    MediSync
                                </h1>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-green-600">
                                    Directory App
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={closeMobileMenu}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                        <div>
                            <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                                Overview
                            </p>
                            <SidebarLink to="/" label="Dashboard" Icon={LayoutDashboard} onClick={closeMobileMenu} />
                        </div>

                        <div>
                            <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                                Directory & Stock
                            </p>
                            <div className="space-y-1">
                                <SidebarLink to="/medicines" label="Medicines" Icon={Pill} onClick={closeMobileMenu} />
                                <SidebarLink to="/brands" label="Brands" Icon={Tag} onClick={closeMobileMenu} />
                                <SidebarLink to="/categories" label="Categories" Icon={Layers} onClick={closeMobileMenu} />
                            </div>
                        </div>

                        <div>
                            <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                                System
                            </p>
                            <div className="space-y-1">
                                <SidebarLink to="/sales" label="Sales & Billing" Icon={ShoppingBag} badge="POS" onClick={closeMobileMenu} />
                                <SidebarLink to="/settings" label="Settings" Icon={SettingsIcon} onClick={closeMobileMenu} />
                            </div>
                        </div>
                    </nav>
                </aside>

                {/* DESKTOP PERMANENT SIDEBAR */}
                <aside className="hidden md:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex-col sticky top-0 h-screen shadow-sm z-30">
                    {/* Brand Logo Header */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-green-600 text-white shadow-md shadow-green-600/20">
                            <Pill size={22} className="rotate-45" />
                        </div>
                        <div>
                            <h1 className="font-black text-slate-900 dark:text-white text-lg tracking-tight leading-none">
                                MediSync
                            </h1>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-green-600">
                                Sales & Inventory
                            </span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                        <div>
                            <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                                Overview
                            </p>
                            <SidebarLink to="/" label="Dashboard" Icon={LayoutDashboard} />
                        </div>

                        <div>
                            <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                                Directory & Stock
                            </p>
                            <div className="space-y-1">
                                <SidebarLink to="/medicines" label="Medicines" Icon={Pill} />
                                <SidebarLink to="/brands" label="Brands" Icon={Tag} />
                                <SidebarLink to="/categories" label="Categories" Icon={Layers} />
                            </div>
                        </div>

                        <div>
                            <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                                System
                            </p>
                            <div className="space-y-1">
                                <SidebarLink to="/sales" label="Sales & Billing" Icon={ShoppingBag} badge="POS" />
                                <SidebarLink to="/settings" label="Settings" Icon={SettingsIcon} />
                            </div>
                        </div>
                    </nav>

                    {/* Footer System Status Card */}
                    <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                                </span>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">System Online</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                v1.2.0
                            </span>
                        </div>
                    </div>
                </aside>

                {/* 2. MAIN CONTENT AREA */}
                <div className="flex-1 flex flex-col min-w-0">
                    <Navbar onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                    <main className="flex-1 overflow-y-auto">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/medicines" element={<MedicineLists />} />
                            <Route path="/medicines/:id" element={<Medicine />} />
                            <Route path="/brands" element={<BrandLists />} />
                            <Route path="/brands/:id" element={<Brand />} />
                            <Route path="/categories" element={<CategoryLists />} />
                            <Route path="/categories/:id" element={<Category />} />
                            <Route path="/sales" element={<Dashboard />} />
                            <Route path="/settings" element={<Settings />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </ThemeProvider>
    );
};

// Helper Component for Sidebar Links
interface SidebarLinkProps {
    to: string;
    label: string;
    Icon: LucideIcon;
    badge?: string;
    onClick?: () => void;
}

const SidebarLink = ({ to, label, Icon, badge, onClick }: SidebarLinkProps) => (
    <NavLink
        to={to}
        end={to === "/"}
        onClick={onClick}
        className={({ isActive }) =>
            `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                    ? "bg-green-600 text-white shadow-md shadow-green-600/20"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            }`
        }
    >
        <div className="flex items-center gap-3">
            <Icon size={18} />
            <span>{label}</span>
        </div>
        {badge && (
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300">
                {badge}
            </span>
        )}
    </NavLink>
);