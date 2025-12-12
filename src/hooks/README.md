# Permission System - Hướng dẫn sử dụng

Hệ thống phân quyền Frontend được tích hợp với Backend để ẩn/hiện các chức năng dựa trên permissions của user.

## Cấu trúc

1. **useAuth** - Hook để lấy thông tin user và permissions
2. **usePermission** - Hook để check permissions
3. **ProtectedContent** - Component để ẩn/hiện UI dựa trên permission

## Cách sử dụng

### 1. useAuth Hook

```tsx
import { useAuth } from "@/hooks";

function MyComponent() {
  const {
    account,
    isAuthenticated,
    permissions,
    isLoading,
    isSyncingPermissions,
    syncPermissions,
  } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  // Sync permissions from server (optional)
  const handleSyncPermissions = async () => {
    await syncPermissions();
  };

  return (
    <div>
      <p>Welcome, {account?.fullName}</p>
      <p>Your permissions: {permissions.join(", ")}</p>
      <button onClick={handleSyncPermissions} disabled={isSyncingPermissions}>
        {isSyncingPermissions ? "Syncing..." : "Sync Permissions"}
      </button>
    </div>
  );
}
```

**API Integration:**

- `useAuth` đọc permissions từ localStorage (sau khi login)
- `syncPermissions()` gọi API `/auth/check-permission` để lấy permissions mới nhất từ server
- Permissions được tự động cập nhật khi sync thành công

### 2. usePermission Hook

```tsx
import { usePermission } from "@/hooks";
import { Resource, Permission } from "@/types/permission.type";

function MyComponent() {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isAdmin } =
    usePermission();

  // Check single permission
  const canCreateAccount = hasPermission(Resource.ACCOUNT, Permission.CREATE);

  // Check any of multiple permissions
  const canManageReports = hasAnyPermission(Resource.REPORT, [
    Permission.CREATE,
    Permission.UPDATE,
  ]);

  // Check all permissions
  const canFullyManage = hasAllPermissions(Resource.ACCOUNT, [
    Permission.CREATE,
    Permission.UPDATE,
    Permission.DELETE,
  ]);

  return (
    <div>
      {canCreateAccount && <Button>Create Account</Button>}
      {canManageReports && <Button>Manage Reports</Button>}
      {isAdmin && <Button>Admin Panel</Button>}
    </div>
  );
}
```

### 3. ProtectedContent Component

```tsx
import { ProtectedContent } from "@/components/ProtectedContent";
import { Resource, Permission } from "@/types/permission.type";

function MyComponent() {
  return (
    <div>
      {/* Show button only if user can create accounts */}
      <ProtectedContent resource={Resource.ACCOUNT} action={Permission.CREATE}>
        <Button>Create Account</Button>
      </ProtectedContent>

      {/* Show menu if user has ANY of these permissions */}
      <ProtectedContent
        resource={Resource.REPORT}
        actions={[Permission.CREATE, Permission.UPDATE]}
      >
        <Menu>Report Menu</Menu>
      </ProtectedContent>

      {/* Show form only if user has ALL permissions */}
      <ProtectedContent
        resource={Resource.ACCOUNT}
        actions={[Permission.CREATE, Permission.UPDATE]}
        requireAll
      >
        <Form>Advanced Form</Form>
      </ProtectedContent>

      {/* Show fallback when permission denied */}
      <ProtectedContent
        resource={Resource.ACCOUNT}
        action={Permission.DELETE}
        fallback={<p>You don't have permission to delete</p>}
      >
        <Button variant="destructive">Delete Account</Button>
      </ProtectedContent>
    </div>
  );
}
```

## Permission Format

Permissions được lưu dưới dạng string: `RESOURCE:ACTION`

Ví dụ:

- `ACCOUNT:CREATE` - Permission để tạo account
- `REPORT:READ` - Permission để xem report
- `ACCOUNT:ALL` - Permission để làm tất cả actions trên ACCOUNT
- `ACCOUNT:ADMIN_ACTION` - Super admin permission

## Special Permissions

- **ALL**: Nếu user có `RESOURCE:ALL`, user sẽ có tất cả permissions cho resource đó
- **ADMIN_ACTION**: Nếu user có bất kỳ permission nào chứa `:ADMIN_ACTION`, user được coi là admin và có tất cả permissions

## Resources và Permissions

Xem file `src/types/permission.type.ts` để xem danh sách đầy đủ Resources và Permissions.
