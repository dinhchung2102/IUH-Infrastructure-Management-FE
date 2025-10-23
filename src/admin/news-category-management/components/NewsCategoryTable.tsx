import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import type { NewsCategory } from "../types/news-category.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface NewsCategoryTableProps {
  categories: NewsCategory[];
  currentPage: number;
  itemsPerPage: number;
  onViewDetails: (category: NewsCategory) => void;
  onEdit: (category: NewsCategory) => void;
  onDelete: (id: string, name: string) => void;
}

export function NewsCategoryTable({
  categories,
  currentPage,
  itemsPerPage,
  onViewDetails,
  onEdit,
  onDelete,
}: NewsCategoryTableProps) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">STT</TableHead>
            <TableHead className="w-[100px]">Hình ảnh</TableHead>
            <TableHead>Tên danh mục</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead className="w-[120px]">Trạng thái</TableHead>
            <TableHead className="w-[140px]">Ngày tạo</TableHead>
            <TableHead className="w-[80px]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <p className="text-muted-foreground">Không có danh mục nào</p>
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category, index) => (
              <TableRow key={category._id}>
                <TableCell className="font-medium">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell>
                  {category.image ? (
                    <img
                      src={
                        category.image.startsWith("http")
                          ? category.image
                          : `${import.meta.env.VITE_URL_UPLOADS}${
                              category.image
                            }`
                      }
                      alt={category.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        No image
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {category.slug}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {category.description || "—"}
                  </p>
                </TableCell>
                <TableCell>
                  {category.isActive ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Hoạt động
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                      Ngưng
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(category.createdAt), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onViewDetails(category)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(category)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(category._id, category.name)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
