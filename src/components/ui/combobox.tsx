"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxProps {
  options: { value: string; label: string }[];
  value?: string;
  onValueChange?: (value: string) => void;
  onSearchChange?: (search: string) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
}

export function Combobox({
  options,
  value,
  onValueChange,
  onSearchChange,
  placeholder = "Select...",
  className,
  isLoading = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const selectedOption = options.find((option) => option.value === value);

  React.useEffect(() => {
    if (!open) {
      setSearchValue("");
    }
  }, [open]);

  React.useEffect(() => {
    if (!onSearchChange) return;
    onSearchChange(searchValue);
  }, [searchValue, onSearchChange]);

  const handleSearchChange = (search: string) => {
    setSearchValue(search);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search..."
            className="h-9"
            value={searchValue}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>Đang tải...</CommandEmpty>
            ) : options.length === 0 ? (
              <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
            ) : (
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      onValueChange?.(
                        option.value === value ? "" : option.value
                      );
                      setOpen(false);
                      setSearchValue("");
                    }}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

