import { useState, useEffect } from "react";

/**
 * Custom hook for managing the application's light/dark theme.
 * Handles reading from/writing to localStorage, checking OS preference,
 * and applying the `.light-theme` class to the document body.
 *
 * @returns {Array} [theme, toggleTheme]
 */
export function useTheme() {
  // 1. Initialize state based on localStorage or OS preference
  const [theme, _setTheme] = useState("dark");

  // 2. Apply theme class to document body whenever it changes
  useEffect(() => {
    // Implementation here
  }, [theme]);

  // 3. Provide a toggle function
  const toggleTheme = () => {
    // Implementation here
  };

  return [theme, toggleTheme];
}
