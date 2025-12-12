import { useEffect, useState } from "react";
import { AlertTriangle, MapPin, Building2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CriticalReportNotification } from "@/types/notification.type";
import {
  playCriticalAlertSound,
  stopCriticalAlertSound,
} from "@/utils/sound.util";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface CriticalReportAlertProps {
  notification: CriticalReportNotification;
  onClose: () => void;
}

/**
 * Component to display critical report alert notification
 * Shows immediately when a critical report is created (no approval needed)
 */
export function CriticalReportAlert({
  notification,
  onClose,
}: CriticalReportAlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  // Play alert sound when notification appears (loop until stopped)
  useEffect(() => {
    playCriticalAlertSound();

    // Cleanup: stop audio when component unmounts
    return () => {
      stopCriticalAlertSound();
    };
  }, []);

  const handleConfirm = () => {
    // Stop audio first
    stopCriticalAlertSound();

    setIsAnimating(false);
    // Wait for animation to complete before removing
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const createdAt = notification.data.createdAt
    ? new Date(notification.data.createdAt)
    : new Date();

  // Build location display
  const location = notification.data.location;
  const locationParts: string[] = [];
  if (location?.campus) locationParts.push(location.campus.name);
  if (location?.building) locationParts.push(location.building.name);
  if (location?.zone) locationParts.push(location.zone.name);
  if (location?.area) locationParts.push(location.area.name);

  const locationDisplay =
    location?.fullPath || locationParts.join(" > ") || "Chưa xác định";

  return (
    <>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" />

      {/* Center modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className={`max-w-2xl w-full transition-all duration-300 ${
            isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <Card className="border border-red-500/50 shadow-2xl bg-white">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                <div className="rounded-full bg-red-600 p-3">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {format(createdAt, "dd/MM/yyyy HH:mm:ss", { locale: vi })}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-5">
                {/* Location - QUAN TRỌNG */}
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                        Vị trí
                      </p>
                      <p className="font-bold text-lg text-foreground break-words mb-3">
                        {locationDisplay}
                      </p>
                      {/* Location details */}
                      <div className="space-y-2">
                        {location?.campus && (
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Home className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Cơ sở:</span>
                            <span>{location.campus.name}</span>
                          </div>
                        )}
                        {location?.building && (
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Tòa nhà:</span>
                            <span>{location.building.name}</span>
                          </div>
                        )}
                        {location?.zone && (
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Khu vực:</span>
                            <span>{location.zone.name}</span>
                          </div>
                        )}
                        {location?.area && (
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              Khu vực ngoài trời:
                            </span>
                            <span>{location.area.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Asset Info */}
                {notification.data.assetName && (
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                      Thiết bị
                    </p>
                    <p className="font-bold text-base text-foreground">
                      {notification.data.assetName}
                    </p>
                    {notification.data.assetCode && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Mã: {notification.data.assetCode}
                      </p>
                    )}
                  </div>
                )}

                {/* Description */}
                <div className="bg-muted/30 rounded-lg p-4 border border-border">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {notification.message || notification.data.description}
                  </p>
                </div>

                {/* Created By */}
                {notification.data.createdByName && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Báo cáo bởi:</span>
                    <span className="font-semibold text-foreground">
                      {notification.data.createdByName}
                    </span>
                  </div>
                )}

                {/* Action - Chỉ 1 button Xác nhận */}
                <div className="pt-4">
                  <Button
                    onClick={handleConfirm}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-base py-6"
                    size="lg"
                  >
                    Xác nhận
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
