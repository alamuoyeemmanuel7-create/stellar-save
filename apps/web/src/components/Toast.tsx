"use client";

import { useNotifications } from "@/lib/notifications";

export function ToastContainer() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        maxWidth: "400px",
      }}
    >
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

function Toast({ notification, onClose }: { notification: any; onClose: () => void }) {
  const typeStyles: Record<string, any> = {
    success: {
      bg: "rgba(79, 209, 138, 0.15)",
      border: "1px solid var(--good)",
      color: "var(--good)",
      icon: "✓",
    },
    error: {
      bg: "rgba(224, 138, 79, 0.15)",
      border: "1px solid var(--pending)",
      color: "var(--pending)",
      icon: "⚠",
    },
    info: {
      bg: "rgba(224, 179, 79, 0.15)",
      border: "1px solid var(--accent)",
      color: "var(--accent)",
      icon: "ℹ",
    },
    pending: {
      bg: "rgba(224, 179, 79, 0.15)",
      border: "1px solid var(--accent)",
      color: "var(--accent)",
      icon: "⏳",
    },
  };

  const style = typeStyles[notification.type];

  return (
    <div
      style={{
        background: style.bg,
        border: style.border,
        borderRadius: "6px",
        padding: "1rem",
        color: style.color,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "0.5rem",
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <div>
        <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
          {style.icon} {notification.title}
        </div>
        {notification.message && (
          <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>{notification.message}</div>
        )}
      </div>
      {notification.type !== "pending" && (
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            fontSize: "1.2rem",
            padding: 0,
            marginTop: "-0.25rem",
          }}
        >
          ×
        </button>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
