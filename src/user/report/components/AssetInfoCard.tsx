import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Package, Building2 } from "lucide-react";
import type { AssetResponse } from "../api/asset.api";

interface AssetInfoCardProps {
  asset: AssetResponse;
}

export function AssetInfoCard({ asset }: AssetInfoCardProps) {
  return (
    <Card className="border border-gray-200 shadow-lg bg-white rounded-xl overflow-hidden">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <img
            src="/src/assets/logo/iuh_logo-official.png"
            alt="IUH Logo"
            className="h-14 w-auto"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {/* 2-Column Grid: Image Left, Info Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column: Asset Image */}
          {asset?.image && (
            <div className="w-full">
              <img
                src={`${import.meta.env.VITE_URL_UPLOADS}${asset.image}`}
                alt={asset.name}
                className="w-full h-auto max-h-[300px] sm:max-h-[400px] object-contain rounded-lg"
              />
            </div>
          )}

          {/* Right Column: Asset Info */}
          <div className="space-y-3 sm:space-y-4">
            {/* Basic Info */}
            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">
                  Tên thiết bị
                </p>
                <p
                  className="font-semibold text-base sm:text-lg lg:text-xl text-gray-800 break-words"
                  title={asset.name}
                >
                  {asset.name}
                </p>
              </div>
            </div>

            {/* Location Info */}
            <div className="pt-3 sm:pt-4 space-y-2 sm:space-y-3">
              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg border border-gray-200">
                <div className="p-1.5 sm:p-2 bg-white rounded-lg flex-shrink-0">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                    Cơ sở
                  </p>
                  <p className="font-semibold text-sm sm:text-base text-gray-800 break-words">
                    {asset.zone.building.campus.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg border border-gray-200">
                <div className="p-1.5 sm:p-2 bg-white rounded-lg flex-shrink-0">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                    Tòa nhà
                  </p>
                  <p className="font-semibold text-sm sm:text-base text-gray-800 break-words">
                    {asset.zone.building.name} - Tầng {asset.zone.floorLocation}
                  </p>
                </div>
              </div>

              {asset.zone.name && (
                <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg border border-gray-200">
                  <div className="p-1.5 sm:p-2 bg-white rounded-lg flex-shrink-0">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                      Khu vực
                    </p>
                    <p className="font-semibold text-sm sm:text-base text-gray-800 break-words">
                      {asset.zone.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
