import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { PaginationResponse } from "@/types/pagination.type";

interface PaginationComponentProps {
  pagination: PaginationResponse;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function PaginationComponent({
  pagination,
  currentPage,
  onPageChange,
}: PaginationComponentProps) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-end mt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="outline"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              size="sm"
              asChild
            >
              <PaginationPrevious />
            </Button>
          </PaginationItem>
          {Array.from({ length: pagination.totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <Button
                variant={i + 1 === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(i + 1)}
              >
                {i + 1}
              </Button>
            </PaginationItem>
          ))}
          <PaginationItem>
            <Button
              variant="outline"
              onClick={() =>
                onPageChange(Math.min(pagination.totalPages, currentPage + 1))
              }
              disabled={currentPage === pagination.totalPages}
              size="sm"
              asChild
            >
              <PaginationNext />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
