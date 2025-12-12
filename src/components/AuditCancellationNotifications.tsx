import { useEffect } from "react";
import { useSocket } from "@/hooks/use-socket";
import { AuditCancellationNotification } from "./AuditCancellationNotification";

/**
 * Global component to display audit cancellation notifications
 * Renders all active audit cancellation notifications as toasts
 */
export function AuditCancellationNotifications() {
  const { auditCancellations, removeAuditCancellation } = useSocket();

  useEffect(() => {
    // Each notification will be handled by AuditCancellationNotification component
    // which shows a toast and auto-dismisses
    // We can remove them after they're shown
    auditCancellations.forEach((notification) => {
      // Remove after showing (toast will handle display)
      setTimeout(() => {
        removeAuditCancellation(notification.data.auditLogId);
      }, 11000); // Slightly longer than toast duration
    });
  }, [auditCancellations, removeAuditCancellation]);

  return (
    <>
      {auditCancellations.map((notification) => (
        <AuditCancellationNotification
          key={notification.data.auditLogId}
          notification={notification}
        />
      ))}
    </>
  );
}

