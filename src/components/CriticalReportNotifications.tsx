import { useEffect } from "react";
import { useSocket } from "@/hooks/use-socket";
import { CriticalReportAlert } from "./CriticalReportAlert";

/**
 * Global component to display critical report notifications
 * Renders all active critical notifications
 */
export function CriticalReportNotifications() {
  const { notifications, removeNotification, isConnected } = useSocket();

  // Log connection status
  useEffect(() => {
    if (isConnected) {
      console.log(
        "🔌 Socket connected - Ready to receive critical notifications"
      );
    } else {
      console.log("⚠️ Socket disconnected - Notifications unavailable");
    }
  }, [isConnected]);

  if (notifications.length === 0) {
    return null;
  }

  // Only show the latest notification in center
  // If multiple notifications, show the most recent one
  const latestNotification = notifications[0];

  if (!latestNotification) {
    return null;
  }

  return (
    <CriticalReportAlert
      notification={latestNotification}
      onClose={() => removeNotification(latestNotification.data.reportId)}
    />
  );
}
