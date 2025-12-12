import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { AuditCancellationNotification as NotificationType } from "@/types/notification.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface AuditCancellationNotificationProps {
  notification: NotificationType;
}

/**
 * Component to display audit cancellation notification as toast
 * Shows when an audit log is cancelled by admin or staff
 */
export function AuditCancellationNotification({
  notification,
}: AuditCancellationNotificationProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const cancelledAt = notification.data.cancelledAt
      ? new Date(notification.data.cancelledAt)
      : new Date();

    const formattedDate = format(cancelledAt, "dd/MM/yyyy HH:mm:ss", {
      locale: vi,
    });

    // Show toast notification
    const toastId = toast.warning(notification.title, {
      description: (
        <div className="space-y-2">
          <p className="text-sm">{notification.message}</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Nhiệm vụ:</span>{" "}
              <span>{notification.data.subject}</span>
            </div>
            <div>
              <span className="font-medium">Hủy bởi:</span>{" "}
              <span>{notification.data.cancelledBy}</span>
            </div>
            <div>
              <span className="font-medium">Thời gian:</span>{" "}
              <span>{formattedDate}</span>
            </div>
            {notification.data.cancelReason && (
              <div className="mt-2 pt-2 border-t">
                <span className="font-medium">Lý do:</span>
                <p className="text-xs mt-1">{notification.data.cancelReason}</p>
              </div>
            )}
          </div>
        </div>
      ),
      duration: 10000, // 10 seconds
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
      action: {
        label: "Xem chi tiết",
        onClick: () => {
          navigate(`/admin/audits`);
          // Optionally, you could pass state to open the specific audit dialog
        },
      },
      className: "cursor-pointer",
    });

    return () => {
      toast.dismiss(toastId);
    };
  }, [notification, navigate]);

  return null; // This component only shows toast, doesn't render anything
}
