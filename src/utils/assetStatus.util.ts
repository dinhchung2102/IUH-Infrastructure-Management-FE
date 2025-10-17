/**
 * Utility functions for Asset Status
 */

export const getAssetStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    NEW: "Mới",
    IN_USE: "Đang sử dụng",
    UNDER_MAINTENANCE: "Đang bảo trì",
    DAMAGED: "Hư hỏng",
    LOST: "Mất",
    DISPOSED: "Đã thanh lý",
    TRANSFERRED: "Đã chuyển giao",
  };
  return statusMap[status] || status;
};

export const getAssetStatusConfig = (
  status: string
): { label: string; className: string } => {
  const statusConfigMap: Record<string, { label: string; className: string }> =
    {
      NEW: {
        label: "Mới",
        className:
          "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
      },
      IN_USE: {
        label: "Đang sử dụng",
        className:
          "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
      },
      UNDER_MAINTENANCE: {
        label: "Đang bảo trì",
        className:
          "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200",
      },
      DAMAGED: {
        label: "Hư hỏng",
        className: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
      },
      LOST: {
        label: "Mất",
        className:
          "bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200",
      },
      DISPOSED: {
        label: "Đã thanh lý",
        className:
          "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200",
      },
      TRANSFERRED: {
        label: "Đã chuyển giao",
        className:
          "bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-indigo-200",
      },
    };

  return (
    statusConfigMap[status] || {
      label: status,
      className: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200",
    }
  );
};
