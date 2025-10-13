# Account Management Hooks

Custom hooks để quản lý logic của Account Management module.

## Hooks

### `useAccountManagement` ⭐ (Recommended)

Hook tổng hợp tất cả logic cần thiết cho Account Management. **Đây là hook chính bạn nên sử dụng**.

**Usage:**

```tsx
import { useAccountManagement } from "../hooks";

function AccountPage() {
  const {
    accounts, // Danh sách accounts
    loading, // Loading state
    filters, // Current filters
    pagination, // Pagination info
    paginationRequest, // Current pagination request
    handleFiltersChange, // Function to update filters
    handleSortChange, // Function to change sort
    handlePageChange, // Function to change page
    refetch, // Function to refetch data
  } = useAccountManagement();

  return (
    <AccountTable
      accounts={accounts}
      loading={loading}
      filters={filters}
      paginationRequest={paginationRequest}
      onFiltersChange={handleFiltersChange}
      onSortChange={handleSortChange}
    />
  );
}
```

---

### `useAccountFilters`

Hook để quản lý filters state và logic.

**Usage:**

```tsx
import { useAccountFilters } from "../hooks";

const {
  filters, // Current filters
  updateFilters, // Update filters
  clearFilters, // Clear all filters
  hasActiveFilters, // Check if any filter is active
} = useAccountFilters();
```

---

### `useAccountPagination`

Hook để quản lý pagination và sorting state.

**Usage:**

```tsx
import { useAccountPagination } from "../hooks";

const {
  paginationRequest, // Current pagination request
  pagination, // Pagination response from API
  updatePagination, // Update pagination from API
  changePage, // Change current page
  changeSort, // Change sort field and order
  resetToFirstPage, // Reset to page 1
} = useAccountPagination();
```

---

### `useAccountData`

Hook để fetch data từ API.

**Usage:**

```tsx
import { useAccountData } from "../hooks";

const {
  accounts, // Danh sách accounts
  loading, // Loading state
  error, // Error state
  refetch, // Refetch function
} = useAccountData({
  filters,
  paginationRequest,
  onPaginationUpdate,
});
```

## Architecture

```
┌─────────────────────────────────────┐
│    useAccountManagement             │
│  (Main hook - combines all)         │
└─────────────┬───────────────────────┘
              │
              ├─── useAccountFilters
              │    ├── filters state
              │    ├── updateFilters()
              │    └── clearFilters()
              │
              ├─── useAccountPagination
              │    ├── pagination state
              │    ├── changePage()
              │    └── changeSort()
              │
              └─── useAccountData
                   ├── fetch accounts
                   ├── loading state
                   └── error handling
```

## Benefits

- ✅ **Separation of Concerns**: Logic tách biệt khỏi UI
- ✅ **Reusability**: Có thể reuse cho các components khác
- ✅ **Testability**: Dễ dàng test logic riêng biệt
- ✅ **Maintainability**: Code dễ đọc và maintain
- ✅ **Type Safety**: Full TypeScript support
