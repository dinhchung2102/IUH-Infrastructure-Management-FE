"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Package,
  MapPin,
  Image as ImageIcon,
  Info,
  X,
} from "lucide-react";
import type { AssetListItem } from "../hooks";
import { useAssetAddForm } from "../hooks";

interface AssetAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: "add" | "edit";
  asset?: AssetListItem | null;
}

export function AssetAddDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = "add",
  asset,
}: AssetAddDialogProps) {
  const {
    form,
    loading,
    types,
    categories,
    imagePreview,
    handleChange,
    handleImageChange,
    handleSubmit,
    // Cascading selection
    campuses,
    selectedCampus,
    setSelectedCampus,
    areaType,
    setAreaType,
    areaTypes,
    buildings,
    selectedBuilding,
    setSelectedBuilding,
    selectedFloor,
    setSelectedFloor,
    availableFloors,
    outdoorAreas,
    indoorZones,
    setZone,
    setArea,
  } = useAssetAddForm({
    open,
    mode,
    asset,
    onSuccess,
    onClose: () => onOpenChange(false),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="h-5 w-5" />
            {mode === "edit" ? "Chỉnh sửa thiết bị" : "Thêm thiết bị mới"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Cập nhật thông tin thiết bị trong hệ thống."
              : "Điền đầy đủ thông tin để thêm thiết bị mới."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                Thông tin cơ bản
              </h3>
            </div>
            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Tên thiết bị */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Tên thiết bị <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="VD: Máy chiếu Epson EB-X06"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  className="bg-white"
                />
              </div>

              {/* Mã thiết bị */}
              <div className="space-y-2">
                <Label htmlFor="code">Mã thiết bị</Label>
                <Input
                  id="code"
                  placeholder="VD: ASSET001"
                  value={form.code}
                  onChange={(e) => handleChange("code", e.target.value)}
                  className="bg-white"
                />
              </div>

              {/* Trạng thái - chỉ hiển thị khi edit */}
              {mode === "edit" && (
                <div className="space-y-2">
                  <Label htmlFor="status">
                    Trạng thái <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.status}
                    onValueChange={(val) => handleChange("status", val)}
                  >
                    <SelectTrigger id="status" className="bg-white">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN_USE">Đang sử dụng</SelectItem>
                      <SelectItem value="MAINTENANCE">Đang bảo trì</SelectItem>
                      <SelectItem value="RETIRED">Đã nghỉ hưu</SelectItem>
                      <SelectItem value="DISPOSED">Đã thanh lý</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Mô tả */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả chi tiết về thiết bị"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                  className="bg-white"
                />
              </div>
            </div>
          </div>

          {/* Category & Type Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                Phân loại
              </h3>
            </div>
            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Loại thiết bị */}
              <div className="space-y-2">
                <Label>
                  Loại thiết bị <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.assetType}
                  onValueChange={(val) => handleChange("assetType", val)}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((t) => (
                      <SelectItem key={t._id} value={t._id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Danh mục thiết bị */}
              <div className="space-y-2">
                <Label>
                  Danh mục thiết bị <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.assetCategory}
                  onValueChange={(val) => handleChange("assetCategory", val)}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                Vị trí <span className="text-red-500">*</span>
              </h3>
            </div>
            <Separator />

            <div className="space-y-4">
              {/* Row 1: Campus + Area Type */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Campus */}
                <div className="space-y-2">
                  <Label htmlFor="campus">Cơ sở</Label>
                  <Select
                    value={selectedCampus || undefined}
                    onValueChange={setSelectedCampus}
                  >
                    <SelectTrigger id="campus" className="bg-white">
                      <SelectValue placeholder="Chọn cơ sở" />
                    </SelectTrigger>
                    <SelectContent>
                      {campuses.map((campus) => (
                        <SelectItem key={campus._id} value={campus._id}>
                          {campus.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Area Type */}
                <div className="space-y-2">
                  <Label htmlFor="area-type">Loại khu vực</Label>
                  <Select
                    value={areaType || undefined}
                    onValueChange={(val) =>
                      setAreaType(val as "outdoor" | "building" | "")
                    }
                    disabled={!selectedCampus}
                  >
                    <SelectTrigger
                      id="area-type"
                      className="bg-white"
                      disabled={!selectedCampus}
                    >
                      <SelectValue
                        placeholder={
                          !selectedCampus
                            ? "Vui lòng chọn cơ sở trước"
                            : "Chọn loại khu vực"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {areaTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2: Building/Area */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Outdoor Area OR Building */}
                {areaType === "outdoor" ? (
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="outdoor-area">Khu vực ngoài trời</Label>
                    <Select
                      value={form.area || undefined}
                      onValueChange={setArea}
                      disabled={!areaType}
                    >
                      <SelectTrigger
                        id="outdoor-area"
                        className="bg-white"
                        disabled={!areaType}
                      >
                        <SelectValue
                          placeholder={
                            outdoorAreas.length === 0
                              ? "Không có khu vực"
                              : "Chọn khu vực"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {outdoorAreas.length > 0
                          ? outdoorAreas.map((area) => (
                              <SelectItem key={area._id} value={area._id}>
                                {area.name}
                              </SelectItem>
                            ))
                          : null}
                      </SelectContent>
                    </Select>
                  </div>
                ) : areaType === "building" ? (
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="building">Tòa nhà</Label>
                    <Select
                      value={selectedBuilding || undefined}
                      onValueChange={setSelectedBuilding}
                      disabled={!areaType}
                    >
                      <SelectTrigger
                        id="building"
                        className="bg-white"
                        disabled={!areaType}
                      >
                        <SelectValue
                          placeholder={
                            buildings.length === 0
                              ? "Không có tòa nhà"
                              : "Chọn tòa nhà"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {buildings.length > 0
                          ? buildings.map((building) => (
                              <SelectItem
                                key={building._id}
                                value={building._id}
                              >
                                {building.name}
                              </SelectItem>
                            ))
                          : null}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2 sm:col-span-2">
                    <Label
                      htmlFor="placeholder-location"
                      className="text-muted-foreground"
                    >
                      Vị trí
                    </Label>
                    <Select disabled>
                      <SelectTrigger
                        id="placeholder-location"
                        className="bg-white"
                      >
                        <SelectValue placeholder="Vui lòng chọn loại khu vực" />
                      </SelectTrigger>
                    </Select>
                  </div>
                )}
              </div>

              {/* Row 3: Floor (optional) + Zone (for building) */}
              {areaType === "building" && selectedBuilding && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Floor (optional) */}
                  {availableFloors > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="floor">Tầng (tùy chọn)</Label>
                      <Select
                        value={selectedFloor || "all"}
                        onValueChange={(val) =>
                          setSelectedFloor(val === "all" ? "" : val)
                        }
                      >
                        <SelectTrigger id="floor" className="bg-white">
                          <SelectValue placeholder="Tất cả các tầng" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả các tầng</SelectItem>
                          {Array.from(
                            { length: availableFloors },
                            (_, i) => i + 1
                          ).map((floor) => (
                            <SelectItem key={floor} value={floor.toString()}>
                              Tầng {floor}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Zone */}
                  <div className="space-y-2">
                    <Label htmlFor="zone">
                      Phòng/Khu vực <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={form.zone || undefined}
                      onValueChange={setZone}
                      disabled={!selectedBuilding}
                    >
                      <SelectTrigger
                        id="zone"
                        className="bg-white"
                        disabled={!selectedBuilding}
                      >
                        <SelectValue
                          placeholder={
                            !selectedBuilding
                              ? "Vui lòng chọn tòa nhà"
                              : indoorZones.length === 0
                              ? "Không có phòng"
                              : "Chọn phòng"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {indoorZones.length > 0
                          ? indoorZones.map((zone) => (
                              <SelectItem key={zone._id} value={zone._id}>
                                {zone.name}
                                {zone.floorLocation && (
                                  <span className="text-xs text-muted-foreground ml-2">
                                    (Tầng {zone.floorLocation})
                                  </span>
                                )}
                              </SelectItem>
                            ))
                          : null}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Image Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                Hình ảnh
              </h3>
            </div>
            <Separator />

            <div className="space-y-2">
              <Label>Ảnh thiết bị</Label>
              <div className="relative">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleImageChange(file);
                  }}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative group">
                    <div className="w-full h-48 rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden">
                      <img
                        src={
                          imagePreview.startsWith("blob:")
                            ? imagePreview
                            : imagePreview.startsWith("http")
                            ? imagePreview
                            : `${
                                import.meta.env.VITE_URL_UPLOADS
                              }${imagePreview}`
                        }
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/400x300?text=Invalid+Image";
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        handleImageChange(null);
                        const input = document.getElementById(
                          "image"
                        ) as HTMLInputElement;
                        if (input) input.value = "";
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        document.getElementById("image")?.click();
                      }}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Thay đổi ảnh
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="h-10 w-10 text-muted-foreground mb-3" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click để chọn ảnh</span>{" "}
                        hoặc kéo thả vào đây
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG, WebP (tối đa 10MB)
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <DialogFooter className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
              {mode === "edit" ? "Cập nhật" : "Thêm thiết bị"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
