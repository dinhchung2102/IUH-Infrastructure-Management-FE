import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type {
  CriticalReportNotification,
  AuditCancellationNotification,
} from "@/types/notification.type";
import { useAuth } from "./use-auth";

/**
 * Hook to manage socket.io connection for real-time notifications
 */
export function useSocket() {
  const { account, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<
    CriticalReportNotification[]
  >([]);
  const [auditCancellations, setAuditCancellations] = useState<
    AuditCancellationNotification[]
  >([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Only connect if user is authenticated and has account info
    if (!isAuthenticated || !account) {
      if (socketRef.current) {
        socketRef.current.close();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Get WebSocket URL from environment or construct from API URL
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

    // Extract base URL and protocol
    let socketUrl: string;
    if (apiUrl.includes("localhost") || apiUrl.includes("127.0.0.1")) {
      // Development: ws://localhost:3000/events
      socketUrl = "ws://localhost:3000/events";
    } else {
      // Production: Construct from API URL
      // Remove /api suffix if present
      const baseUrl = apiUrl.replace(/\/api$/, "");
      // Extract protocol and host
      const urlObj = new URL(baseUrl);
      const protocol = urlObj.protocol === "https:" ? "wss:" : "ws:";
      socketUrl = `${protocol}//${urlObj.host}/events`;
    }

    // Create socket connection
    const newSocket = io(socketUrl, {
      query: {
        userId: account._id,
        accountId: account._id,
        role: account.role,
      },
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      reconnectionDelayMax: 5000,
    });

    // Connection event handlers
    newSocket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    // Listen for notifications
    newSocket.on(
      "notification",
      (
        data:
          | CriticalReportNotification
          | AuditCancellationNotification
          | unknown
      ) => {
        // Handle critical report notifications
        if (
          typeof data === "object" &&
          data !== null &&
          "type" in data &&
          data.type === "error" &&
          "data" in data &&
          typeof data.data === "object" &&
          data.data !== null &&
          "priority" in data.data &&
          data.data.priority === "CRITICAL"
        ) {
          console.log("Critical report notification received:", data);
          setNotifications((prev) => [
            data as CriticalReportNotification,
            ...prev,
          ]);
        }

        // Handle audit cancellation notifications
        if (
          typeof data === "object" &&
          data !== null &&
          "type" in data &&
          data.type === "warning" &&
          "data" in data &&
          typeof data.data === "object" &&
          data.data !== null &&
          "auditLogId" in data.data &&
          "title" in data &&
          data.title === "Nhiệm vụ kiểm tra đã bị hủy bỏ"
        ) {
          console.log("Audit cancellation notification received:", data);
          setAuditCancellations((prev) => [
            data as AuditCancellationNotification,
            ...prev,
          ]);
        }
      }
    );

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setSocket(null);
      setIsConnected(false);
    };
  }, [isAuthenticated, account]);

  // Function to clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Function to remove a specific notification
  const removeNotification = useCallback((reportId: string) => {
    setNotifications((prev) =>
      prev.filter((n) => n.data.reportId !== reportId)
    );
  }, []);

  // Function to remove a specific audit cancellation notification
  const removeAuditCancellation = useCallback((auditLogId: string) => {
    setAuditCancellations((prev) =>
      prev.filter((n) => n.data.auditLogId !== auditLogId)
    );
  }, []);

  return {
    socket,
    isConnected,
    notifications,
    auditCancellations,
    clearNotifications,
    removeNotification,
    removeAuditCancellation,
  };
}
