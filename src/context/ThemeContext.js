import { createContext, useContext } from "react";
import { Button } from "grommet";
import { Sun, Moon } from "grommet-icons";

export const ThemeContext = createContext({
  theme: "dark",
  setTheme: () => {},
});

export function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      icon={theme !== "dark" ? <Sun /> : <Moon />}
    />
  );
}
