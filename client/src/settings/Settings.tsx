import { Check, Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Settings = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="p-4 sm:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
            {/* PAGE HEADER */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="p-3 rounded-2xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400">
                    <Palette size={24} />
                </div>
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Theme Settings
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Choose your preferred interface theme: Light or Dark mode.
                    </p>
                </div>
            </div>

            {/* THEME SELECTION CARDS */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* LIGHT THEME CARD */}
                    <div
                        onClick={() => setTheme("light")}
                        className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-5 ${theme === "light"
                                ? "border-green-600 bg-green-50/30 dark:bg-green-950/20 shadow-md"
                                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60">
                                <Sun size={26} />
                            </div>
                            {theme === "light" && (
                                <span className="p-1.5 rounded-full bg-green-600 text-white shadow-xs">
                                    <Check size={16} />
                                </span>
                            )}
                        </div>

                        <div>
                            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                Light Theme
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                Clean, high-contrast bright theme ideal for daytime pharmacy operations.
                            </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                Active Mode: {theme === "light" ? "Enabled" : "Disabled"}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                                Light
                            </span>
                        </div>
                    </div>

                    {/* DARK THEME CARD */}
                    <div
                        onClick={() => setTheme("dark")}
                        className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-5 ${theme === "dark"
                                ? "border-green-600 bg-slate-950 text-white shadow-md"
                                : "border-slate-200 dark:border-slate-800 bg-slate-900 text-white hover:border-slate-700"
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="p-3.5 rounded-2xl bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                                <Moon size={26} />
                            </div>
                            {theme === "dark" && (
                                <span className="p-1.5 rounded-full bg-green-600 text-white shadow-xs">
                                    <Check size={16} />
                                </span>
                            )}
                        </div>

                        <div>
                            <h2 className="text-lg font-extrabold text-white">
                                Dark Theme
                            </h2>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                Sleek dark theme reducing eye strain in low-light environments.
                            </p>
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-300">
                                Active Mode: {theme === "dark" ? "Enabled" : "Disabled"}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-indigo-900 text-indigo-200 text-[10px] font-extrabold">
                                Dark
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
