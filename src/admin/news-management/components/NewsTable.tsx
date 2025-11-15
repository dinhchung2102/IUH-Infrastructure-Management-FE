import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Edit, Trash2 } from "lucide-react";
import { TableActionMenu } from "@/components/TableActionMenu";
import type { News, NewsStatus } from "../types/news.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { getNewsStatusBadge } from "@/config/badge.config";

interface NewsTableProps {
  news: News[];
  currentPage: number;
  itemsPerPage: number;
  onViewDetails: (news: News) => void;
  onEdit: (news: News) => void;
  onDelete: (id: string, title: string) => void;
}

const getUserInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function NewsTable({
  news,
  currentPage,
  itemsPerPage,
  onViewDetails,
  onEdit,
  onDelete,
}: NewsTableProps) {
  return (
    <div className="rounded-md border bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">STT</TableHead>
              <TableHead className="w-[80px] md:w-[100px]">Ảnh</TableHead>
              <TableHead className="min-w-[200px]">Tiêu đề</TableHead>
              <TableHead className="hidden lg:table-cell min-w-[120px]">
                Danh mục
              </TableHead>
              <TableHead className="hidden xl:table-cell min-w-[180px]">
                Tác giả
              </TableHead>
              <TableHead className="min-w-[110px]">Trạng thái</TableHead>
              <TableHead className="hidden md:table-cell w-[90px] text-center">
                Lượt xem
              </TableHead>
              <TableHead className="hidden lg:table-cell min-w-[130px]">
                Ngày tạo
              </TableHead>
              <TableHead className="w-[80px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <p className="text-muted-foreground">Không có tin tức nào</p>
                </TableCell>
              </TableRow>
            ) : (
              news.map((item, index) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell>
                    <img
                      src={
                        item.thumbnail.startsWith("http")
                          ? item.thumbnail
                          : `${import.meta.env.VITE_URL_UPLOADS}${
                              item.thumbnail
                            }`
                      }
                      alt={item.title}
                      className="w-12 h-12 md:w-16 md:h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 max-w-[300px]">
                      <p className="font-medium line-clamp-2 text-sm">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1 hidden sm:block">
                        {item.description}
                      </p>
                      {/* Show category on mobile when category column is hidden */}
                      <div className="lg:hidden">
                        {item.category && typeof item.category !== "string" && (
                          <Badge
                            variant="outline"
                            className="font-normal text-xs mt-1"
                          >
                            {item.category.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {item.category ? (
                      typeof item.category === "string" ? (
                        <p className="text-sm">{item.category}</p>
                      ) : (
                        <Badge variant="outline" className="font-normal">
                          {item.category.name}
                        </Badge>
                      )
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        Chưa phân loại
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {typeof item.author === "string" ? (
                      <p className="text-sm">{item.author}</p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          {item.author.avatar && (
                            <AvatarImage
                              src={
                                item.author.avatar.startsWith("http")
                                  ? item.author.avatar
                                  : `${import.meta.env.VITE_URL_UPLOADS}${
                                      item.author.avatar
                                    }`
                              }
                            />
                          )}
                          <AvatarFallback className="text-xs">
                            {getUserInitials(item.author.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.author.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.author.email}
                          </p>
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getNewsStatusBadge(item.status)}</TableCell>
                  <TableCell className="hidden md:table-cell text-center">
                    {item.views || 0}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="text-sm">
                      <p>
                        {format(new Date(item.createdAt), "dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(item.createdAt), "HH:mm", {
                          locale: vi,
                        })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <TableActionMenu
                      showLabel
                      actions={[
                        {
                          label: "Xem chi tiết",
                          icon: Eye,
                          onClick: () => onViewDetails(item),
                        },
                        {
                          label: "Chỉnh sửa",
                          icon: Edit,
                          onClick: () => onEdit(item),
                        },
                        {
                          label: "Xóa",
                          icon: Trash2,
                          onClick: () => onDelete(item._id, item.title),
                          variant: "destructive",
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
