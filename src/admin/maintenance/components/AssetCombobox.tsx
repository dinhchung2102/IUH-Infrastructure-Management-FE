"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAssets } from "@/admin/asset-management/api/asset.api";
import type { AssetResponse } from "@/admin/asset-management/api/asset.api";
import { toast } from "sonner";

interface AssetComboboxProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function AssetCombobox({
  value,
  onValueChange,
  placeholder = "Chọn thiết bị...",
  className,
  disabled = false,
}: AssetComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Actual search query to use for API
  const [assets, setAssets] = useState<AssetResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<AssetResponse | null>(
    null
  );

  const limit = 20; // Items per page

  // Fetch selected asset when value changes
  useEffect(() => {
    if (value && !selectedAsset) {
      fetchAssetById(value);
    } else if (!value) {
      setSelectedAsset(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Fetch assets when popover opens or searchQuery/page changes (offline search)
  useEffect(() => {
    if (open) {
      fetchAssets();
    }
  }, [open, searchQuery, page]);

  // Reset when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchValue("");
      setSearchQuery("");
      setPage(1);
      setAssets([]);
      setHasMore(true);
    }
  }, [open]);

  const fetchAssetById = async (assetId: string) => {
    try {
      const response = await getAssets({ limit: 100 });
      if (response.success && response.data) {
        const asset = response.data.assets.find((a) => a._id === assetId);
        if (asset) {
          setSelectedAsset(asset);
        } else {
          // If not found in first 100, try to fetch by ID directly
          // For now, we'll just set a placeholder
          setSelectedAsset({
            _id: assetId,
            name: "Đang tải...",
            code: "",
            status: "IN_USE",
            createdAt: "",
            updatedAt: "",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching asset:", error);
    }
  };

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getAssets({
        search: searchQuery || undefined, // Use searchQuery instead of searchValue
        page: page,
        limit: limit,
      });

      if (response.success && response.data) {
        const newAssets = response.data.assets || [];

        if (page === 1) {
          setAssets(newAssets);
        } else {
          setAssets((prev) => [...prev, ...newAssets]);
        }

        // Check if there are more pages
        const totalPages = response.data.pagination?.totalPages || 1;
        setHasMore(page < totalPages);

        // If we have a value, find and set the selected asset
        if (value && !selectedAsset) {
          const found = newAssets.find((a) => a._id === value);
          if (found) {
            setSelectedAsset(found);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast.error("Không thể tải danh sách thiết bị");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, page, value, selectedAsset]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    // Don't trigger search immediately - wait for Enter or button click
  };

  const handleSearch = () => {
    setSearchQuery(searchValue.trim());
    setPage(1); // Reset to first page when searching
    setAssets([]); // Clear current assets
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleSelect = (assetId: string) => {
    const asset = assets.find((a) => a._id === assetId);
    if (asset) {
      setSelectedAsset(asset);
      onValueChange?.(assetId === value ? "" : assetId);
      setOpen(false);
      setSearchValue("");
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const bottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 50;
    if (bottom && hasMore && !loading) {
      handleLoadMore();
    }
  };

  const displayValue = selectedAsset
    ? `${selectedAsset.name} (${selectedAsset.code})`
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between", className)}
        >
          <span className="truncate">{displayValue}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="flex flex-col">
          {/* Search Input */}
          <div className="flex items-center border-b px-3 gap-2">
            <Search className="h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc mã thiết bị..."
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="h-9 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSearch}
              disabled={loading}
              className="h-8 px-2 shrink-0"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Tìm"
              )}
            </Button>
          </div>

          {/* Options List */}
          <ScrollArea className="h-[300px]" onScrollCapture={handleScroll}>
            <div className="p-1">
              {loading && assets.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                  Đang tải...
                </div>
              ) : assets.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {searchValue
                    ? "Không tìm thấy thiết bị nào."
                    : "Không có thiết bị nào."}
                </div>
              ) : (
                <div className="space-y-1">
                  {assets.map((asset) => {
                    const isSelected = value === asset._id;
                    const displayText = `${asset.name} (${asset.code})`;
                    return (
                      <div
                        key={asset._id}
                        role="option"
                        aria-selected={isSelected}
                        className={cn(
                          "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus:bg-accent focus:text-accent-foreground",
                          isSelected && "bg-accent text-accent-foreground"
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSelect(asset._id);
                        }}
                        onMouseDown={(e) => {
                          // Prevent popover from closing before onClick fires
                          e.preventDefault();
                        }}
                      >
                        <span className="flex-1 truncate">{displayText}</span>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4 shrink-0",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </div>
                    );
                  })}

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="py-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={handleLoadMore}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang tải...
                          </>
                        ) : (
                          "Tải thêm"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
