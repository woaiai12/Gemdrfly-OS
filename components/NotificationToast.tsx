"use client";

import { useNotification } from "@/contexts/NotificationContext";
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { useEffect } from "react";

export function NotificationToast() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

function NotificationItem({
  notification,
  onClose,
}: {
  notification: any;
  onClose: () => void;
}) {
  useEffect(() => {
    // 触发进入动画
    const element = document.getElementById(`notification-${notification.id}`);
    if (element) {
      element.classList.add("animate-slide-in");
    }

    return () => {
      // 触发离开动画
      if (element) {
        element.classList.remove("animate-slide-in");
        element.classList.add("animate-slide-out");
      }
    };
  }, [notification.id]);

  const icons = {
    success: <CheckCircleOutlined className="text-green-500 text-xl" />,
    error: <CloseCircleOutlined className="text-red-500 text-xl" />,
    info: <InfoCircleOutlined className="text-blue-500 text-xl" />,
    warning: <WarningOutlined className="text-yellow-500 text-xl" />,
  };

  const bgColors = {
    success: "bg-white dark:bg-gray-800 border-l-4 border-green-500",
    error: "bg-white dark:bg-gray-800 border-l-4 border-red-500",
    info: "bg-white dark:bg-gray-800 border-l-4 border-blue-500",
    warning: "bg-white dark:bg-gray-800 border-l-4 border-yellow-500",
  };

  return (
    <div
      id={`notification-${notification.id}`}
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg dark:shadow-gray-900/50 transition-all duration-300 ${bgColors[notification.type]} transform translate-x-0 opacity-100`}
    >
      {icons[notification.type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {notification.message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
