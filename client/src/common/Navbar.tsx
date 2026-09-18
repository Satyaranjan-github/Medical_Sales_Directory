import { ChevronLeft, Menu, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

interface NavbarProps {
    onToggleMobileMenu?: () => void;
}

const Navbar = ({ onToggleMobileMenu }: NavbarProps) => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    const toggleQuickTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <header className="p-4 sm:p-5.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20 shadow-xs transition-colors duration-200">
            <div className="flex items-center gap-3">
                {/* Mobile Menu Toggle Button */}
                <button
                    onClick={onToggleMobileMenu}
                    className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                    aria-label="Toggle Navigation Menu"
                >
                    <Menu size={22} />
                </button>

                <button onClick={() => navigate(-1)} aria-label="Go Back">
                    <ChevronLeft className="size-8 p-1 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors" />
                </button>
            </div>

            <div className="flex items-center gap-3">
                {/* Quick Theme Toggle Button */}
                <button
                    onClick={toggleQuickTheme}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
                    title={theme === "dark" ? "Switch to Bright Mode" : "Switch to Dark Mode"}
                >
                    {theme === "dark" ? (
                        <Sun size={18} className="text-amber-400" />
                    ) : (
                        <Moon size={18} className="text-slate-600" />
                    )}
                </button>

                {/* Avatar */}
                <div className="h-9 w-9 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center text-green-700 dark:text-green-300 font-bold shadow-xs">
                    S
                </div>
            </div>
        </header>
    );
};

export default Navbar;
