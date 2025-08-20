// src/components/ThemeProvider.jsx
import { useEffect } from "react";

const ThemeProvider = ({ children }) => {
  useEffect(() => {
    const applyTheme = () => {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    // Apply theme at start
    applyTheme();

    // Watch for changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);

    // Cleanup
    return () => {
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", applyTheme);
    };
  }, []);

  return <>{children}</>;
};

export default ThemeProvider;
