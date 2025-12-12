export interface CriticalReportNotification {
  type: "error";
  title: string;
  message: string; // Mô tả ngắn gọn của báo cáo (100 ký tự đầu) + vị trí
  data: {
    reportId: string;
    assetId?: string;
    assetName?: string;
    assetCode?: string; // Mã thiết bị
    priority: "CRITICAL";
    reportType: string; // Loại báo cáo: MAINTENANCE, DAMAGED, LOST, etc.
    description: string; // Mô tả đầy đủ của báo cáo
    createdAt: Date | string;
    createdBy?: string;
    createdByName?: string;
    location: {
      // Thông tin vị trí (QUAN TRỌNG)
      campus?: { id: string; name: string }; // Cơ sở
      building?: { id: string; name: string }; // Tòa nhà
      zone?: { id: string; name: string }; // Khu vực trong nhà
      area?: { id: string; name: string }; // Khu vực ngoài trời
      fullPath?: string; // Đường dẫn đầy đủ: "Cơ sở > Tòa nhà > Khu vực"
    };
  };
  timestamp: Date | string;
}

export interface AuditCancellationNotification {
  type: "warning";
  title: string; // "Nhiệm vụ kiểm tra đã bị hủy bỏ"
  message: string; // Mô tả ngắn gọn
  data: {
    auditLogId: string;
    subject: string; // Tên nhiệm vụ
    cancelReason: string; // Lý do hủy
    cancelledBy: string; // Tên người hủy
    cancelledAt: Date | string; // Thời gian hủy
    staffName?: string; // Tên staff (nếu staff hủy)
  };
  timestamp: Date | string;
}
