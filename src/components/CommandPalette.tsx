import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  adminFeatures,
  type AdminFeature,
} from "@/data/admin-features.data";

export function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter features based on search query
  const filteredFeatures = useMemo(() => {
    if (!search.trim()) {
      return adminFeatures;
    }

    const lowerSearch = search.toLowerCase().trim();
    return adminFeatures.filter((feature) => {
      const titleMatch = feature.title.toLowerCase().includes(lowerSearch);
      const descriptionMatch = feature.description
        ?.toLowerCase()
        .includes(lowerSearch);
      const keywordMatch = feature.keywords.some((keyword) =>
        keyword.toLowerCase().includes(lowerSearch)
      );
      const categoryMatch = feature.category.toLowerCase().includes(lowerSearch);

      return titleMatch || descriptionMatch || keywordMatch || categoryMatch;
    });
  }, [search]);

  // Group filtered features by category
  const groupedFeatures = useMemo(() => {
    return filteredFeatures.reduce((acc, feature) => {
      if (!acc[feature.category]) {
        acc[feature.category] = [];
      }
      acc[feature.category].push(feature);
      return acc;
    }, {} as Record<string, AdminFeature[]>);
  }, [filteredFeatures]);

  const handleSelect = (feature: AdminFeature) => {
    navigate(feature.href);
    setOpen(false);
    setSearch("");
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Tìm kiếm chức năng..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="pl-9 md:w-[300px] lg:w-[400px]"
        />
      </div>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-[400px] rounded-md border bg-popover text-popover-foreground shadow-md">
          <div className="max-h-[400px] overflow-y-auto p-1">
            {Object.keys(groupedFeatures).length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Không tìm thấy kết quả.
              </div>
            ) : (
              Object.entries(groupedFeatures).map(([category, features]) => (
                <div key={category}>
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {category}
                  </div>
                  {features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={feature.id}
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent input blur
                          handleSelect(feature);
                        }}
                        className={cn(
                          "relative flex cursor-pointer select-none items-center gap-3 rounded-sm px-3 py-2 text-sm outline-none transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus:bg-accent focus:text-accent-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="flex flex-1 flex-col gap-1">
                          <span className="font-medium">{feature.title}</span>
                          {feature.description && (
                            <span className="text-xs text-muted-foreground">
                              {feature.description}
                            </span>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
