"use client";

import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      type="text"
      icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
      onClick={toggleTheme}
      className="transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
    />
  );
}
