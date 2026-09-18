import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeMode = "light" | "dark";

interface ThemeContextType {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setThemeState] = useState<ThemeMode>(() => {
        const saved = localStorage.getItem("medisync_theme") as ThemeMode;
        return saved === "dark" ? "dark" : "light";
    });

    const setTheme = (newTheme: ThemeMode) => {
        setThemeState(newTheme);
        localStorage.setItem("medisync_theme", newTheme);
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;

        if (theme === "dark") {
            root.classList.add("dark");
            body.classList.add("dark");
            body.style.backgroundColor = "#020617";
            body.style.color = "#f8fafc";
        } else {
            root.classList.remove("dark");
            body.classList.remove("dark");
            body.style.backgroundColor = "#f8fafc";
            body.style.color = "#0f172a";
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
