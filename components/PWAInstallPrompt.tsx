"use client";

import { useEffect, useState } from "react";
import { Button, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      message.success("感谢安装 Gemdrfly OS！");
    }

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  // 检测是否已安装
  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstall(false);
    }
  }, []);

  if (!showInstall || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9998]">
      <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={handleInstallClick}
        size="large"
        className="shadow-lg"
      >
        安装到桌面
      </Button>
    </div>
  );
}
