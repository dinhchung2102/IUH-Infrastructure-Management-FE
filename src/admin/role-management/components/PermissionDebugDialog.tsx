import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Code,
  Plus,
  Trash2,
  Loader2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import type { PermissionEntity } from "../types/permission.type";
import { Resource, Permission } from "@/types/permission.type";
import {
  getPermissions,
  createPermission,
  deletePermission,
} from "../api/role.api";

interface PermissionDebugDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PermissionDebugDialog({
  open,
  onOpenChange,
}: PermissionDebugDialogProps) {
  const [permissions, setPermissions] = useState<PermissionEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // Create form
  const [newResource, setNewResource] = useState<string>("");
  const [newAction, setNewAction] = useState<string>("");

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permToDelete, setPermToDelete] = useState<PermissionEntity | null>(
    null
  );

  useEffect(() => {
    if (open) {
      fetchPermissions();
    }
  }, [open]);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await getPermissions();
      if (response.success && response.data) {
        setPermissions(response.data.permissions);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
      toast.error("Không thể tải danh sách permissions");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newResource || !newAction) {
      toast.error("Vui lòng chọn resource và action");
      return;
    }

    try {
      setCreating(true);
      await createPermission({
        resource: newResource,
        action: newAction,
      });
      toast.success("Tạo permission thành công!");
      setNewResource("");
      setNewAction("");
      fetchPermissions();
    } catch (error) {
      console.error("Error creating permission:", error);
      toast.error("Không thể tạo permission");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteClick = (perm: PermissionEntity) => {
    setPermToDelete(perm);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!permToDelete) return;

    try {
      await deletePermission(permToDelete._id);
      toast.success("Xóa permission thành công!");
      fetchPermissions();
    } catch (error) {
      console.error("Error deleting permission:", error);
      toast.error("Không thể xóa permission");
    } finally {
      setDeleteDialogOpen(false);
      setPermToDelete(null);
    }
  };

  // Group by resource
  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) {
      acc[perm.resource] = [];
    }
    acc[perm.resource].push(perm);
    return acc;
  }, {} as Record<string, PermissionEntity[]>);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] sm:max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              🛠️ Permission Management (Debug Mode)
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-4 w-4" />
              Chức năng dành cho Developer - Sử dụng cẩn thận!
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Create Permission Form */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Tạo Permission Mới
              </h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Resource</Label>
                  <Select value={newResource} onValueChange={setNewResource}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Chọn resource..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Resource).map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Action</Label>
                  <Select value={newAction} onValueChange={setNewAction}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Chọn action..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Permission).map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleCreate}
                  disabled={creating || !newResource || !newAction}
                  className="w-full"
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
                <p className="font-semibold mb-1">Quick Info:</p>
                <p>Total: {permissions.length} permissions</p>
                <p>Resources: {Object.keys(groupedPermissions).length}</p>
              </div>
            </div>

            {/* Permissions List */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">
                  Danh sách Permissions ({permissions.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchPermissions}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>

              <ScrollArea className="h-[500px] border rounded-lg bg-white">
                {loading ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </div>
                ) : permissions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-muted-foreground">
                      Chưa có permission nào
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead className="w-[80px]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {permissions.map((perm, index) => (
                        <TableRow key={perm._id}>
                          <TableCell className="font-mono text-xs">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{perm.resource}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{perm.action}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {perm._id.slice(-8)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(perm)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </div>
          </div>

          <Separator />

          {/* Grouped View */}
          <div>
            <h3 className="font-semibold mb-3">Grouped by Resource</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(groupedPermissions).map(([resource, perms]) => (
                <div
                  key={resource}
                  className="border rounded-lg p-3 bg-muted/30"
                >
                  <h4 className="font-medium text-sm mb-2">{resource}</h4>
                  <div className="flex flex-wrap gap-1">
                    {perms.map((p) => (
                      <Badge
                        key={p._id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {p.action}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa Permission</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa permission này?
              <br />
              <span className="font-mono text-xs">
                {permToDelete?.resource}:{permToDelete?.action}
              </span>
              <br />
              <span className="text-red-600 font-semibold">
                Cảnh báo: Xóa permission có thể ảnh hưởng đến các vai trò đang
                sử dụng!
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
