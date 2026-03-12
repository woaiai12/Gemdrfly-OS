import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { NotificationToast } from "@/components/NotificationToast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gemdrfly OS - AI驱动的行为操作系统",
  description: "帮助用户持续行动，而不是消耗意志力",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <NotificationProvider>
          <ThemeProvider>
            <ConfigProvider locale={zhCN}>
              {children}
              <NotificationToast />
            </ConfigProvider>
          </ThemeProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
