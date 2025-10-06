# Cấu Trúc Thư Mục Dự Án - IUH Facilities Management

## Tổng Quan

Dự án được tổ chức theo mô hình phân tách rõ ràng giữa **User** và **Admin**, với các thành phần UI tái sử dụng và cấu trúc module hóa cao.

```
IUH Facilities Management/
├── public/                 # Tài nguyên tĩnh (static assets)
├── src/                    # Mã nguồn chính
│   ├── admin/             # Module quản trị (Admin)
│   ├── user/              # Module người dùng (User)
│   ├── components/        # Components dùng chung
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Thư viện tiện ích
│   ├── provider/          # Context providers
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Component gốc, cấu hình routing
│   ├── main.tsx           # Entry point
│   └── index.css          # Styles toàn cục
├── package.json           # Dependencies và scripts
├── vite.config.ts         # Cấu hình Vite
└── tsconfig.json          # Cấu hình TypeScript
```

---

## Chi Tiết Cấu Trúc

### 📁 `public/`

Chứa các tài nguyên tĩnh có thể truy cập trực tiếp từ browser.

```
public/
├── iuh_logo-simplified.png    # Logo trường IUH
└── vite.svg                   # Logo Vite
```

**Quy tắc:**

- Các file trong `public/` được truy cập qua đường dẫn `/filename.ext`
- Chỉ đặt các file thực sự tĩnh (không cần xử lý build)
- Ưu tiên đặt logo, favicon, robots.txt ở đây

---

### 📁 `src/components/`

Chứa các components UI dùng chung cho cả User và Admin.

```
components/
├── layout/                    # Layout components
│   ├── MainLayout.tsx        # Layout cho User (có AppBar + Footer)
│   └── AdminLayout.tsx       # Layout cho Admin (có Sidebar)
├── ui/                        # UI components từ shadcn/ui
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── table.tsx
│   └── ...                   # Các component UI khác
├── AppBar.tsx                 # Thanh navigation cho User
├── Footer.tsx                 # Footer cho User
└── SideBar.tsx                # Sidebar cho Admin
```

**Quy tắc:**

- `layout/`: Chứa các layout components chính
- `ui/`: Chứa các base UI components (button, input, dialog...)
- Components ở level cao (`AppBar`, `Footer`, `SideBar`) dùng cho toàn ứng dụng
- Đặt tên file theo PascalCase: `ComponentName.tsx`

---

### 📁 `src/user/`

Module dành cho người dùng thông thường (sinh viên, giảng viên).

```
user/
├── home/                      # Trang chủ
│   └── HomePage.tsx
├── about/                     # Trang giới thiệu
│   ├── AboutPage.tsx
│   ├── components/           # Components riêng cho About
│   └── api/                  # API calls cho About
├── auth/                      # Xác thực người dùng
│   ├── api/
│   │   └── auth.api.ts
│   └── components/
│       ├── LoginDialog.tsx
│       ├── RegisterDialog.tsx
│       ├── OTPDialog.tsx
│       ├── ForgetPassword.tsx
│       └── index.ts
├── contact/                   # Trang liên hệ
│   ├── ContactPage.tsx
│   └── components/
├── news/                      # Trang tin tức
│   ├── NewsPage.tsx
│   └── components/
└── report/                    # Trang báo cáo sự cố
    ├── ReportPage.tsx
    └── components/
```

**Quy tắc:**

- Mỗi feature có một thư mục riêng
- Cấu trúc bên trong mỗi feature:
  ```
  feature-name/
  ├── FeaturePage.tsx          # Page component chính
  ├── components/              # Components riêng cho feature này
  ├── api/                     # API calls
  ├── hooks/                   # Custom hooks (optional)
  └── types/                   # Types (optional)
  ```
- **Page component** đặt tên: `FeatureNamePage.tsx`
- Routes tương ứng:
  - `/` → HomePage
  - `/about` → AboutPage
  - `/contact` → ContactPage
  - `/news` → NewsPage
  - `/report` → ReportPage

---

### 📁 `src/admin/`

Module dành cho quản trị viên.

```
admin/
├── pages/                     # Các trang admin
│   ├── DashboardPage.tsx
│   ├── UsersPage.tsx
│   ├── ReportsPage.tsx
│   └── ...
└── components/                # Components riêng cho Admin
    ├── StatCard.tsx
    ├── DataTable.tsx
    └── ...
```

**Quy tắc:**

- Cấu trúc tương tự `user/` nhưng tập trung vào tính năng quản trị
- Tất cả routes admin bắt đầu với `/admin/*`
- Pages đặt trong `pages/`, components dùng chung đặt trong `components/`
- Ví dụ routes:
  - `/admin` → DashboardPage
  - `/admin/users` → UsersPage
  - `/admin/reports` → ReportsPage

---

### 📁 `src/hooks/`

Custom React hooks dùng chung.

```
hooks/
├── use-auth.ts                # Hook xác thực
├── use-mobile.ts              # Hook detect mobile
└── ...
```

**Quy tắc:**

- Đặt tên file: `use-feature-name.ts`
- Đặt tên hook: `useFeatureName()`
- Chỉ đặt hooks dùng chung cho nhiều components
- Hooks riêng cho một feature nên đặt trong thư mục feature đó

---

### 📁 `src/lib/`

Các thư viện và utility functions.

```
lib/
├── axios.ts                   # Cấu hình Axios instance
└── utils.ts                   # Utility functions (cn, clsx...)
```

**Quy tắc:**

- `axios.ts`: Cấu hình base URL, interceptors
- `utils.ts`: Helper functions dùng chung (formatDate, cn, ...)
- Có thể thêm các file như `api.ts`, `constants.ts`

---

### 📁 `src/types/`

TypeScript type definitions dùng chung.

```
types/
├── error.type.ts              # Error types
├── response.type.ts           # API response types
├── user.type.ts               # User model
└── ...
```

**Quy tắc:**

- Đặt tên file: `entity.type.ts` hoặc `feature.type.ts`
- Export các interfaces/types/enums
- Types riêng cho một feature nên đặt trong thư mục feature đó

---

### 📁 `src/provider/`

React Context Providers.

```
provider/
├── AuthProvider.tsx           # Authentication context
├── ThemeProvider.tsx          # Theme (dark/light mode)
└── ...
```

**Quy tắc:**

- Mỗi provider một file riêng
- Đặt tên: `FeatureProvider.tsx`
- Wrap trong `App.tsx` hoặc `main.tsx`

---

## 🎯 Quy Tắc Đặt Tên

### Files

- **Components**: `PascalCase.tsx` (ví dụ: `LoginDialog.tsx`)
- **Hooks**: `use-kebab-case.ts` (ví dụ: `use-auth.ts`)
- **Types**: `kebab-case.type.ts` (ví dụ: `user.type.ts`)
- **API**: `kebab-case.api.ts` (ví dụ: `auth.api.ts`)
- **Utils**: `kebab-case.ts` (ví dụ: `utils.ts`)

### Folders

- Dùng `kebab-case` cho tất cả thư mục
- Ví dụ: `user-management/`, `facility-report/`

### Components & Functions

- **Components**: `PascalCase` (ví dụ: `LoginDialog`)
- **Functions/Hooks**: `camelCase` (ví dụ: `useAuth`, `formatDate`)
- **Constants**: `UPPER_SNAKE_CASE` (ví dụ: `API_BASE_URL`)

---

## 🔄 Luồng Routing

### User Routes (MainLayout)

```
/ (MainLayout)
├── / → HomePage
├── /about → AboutPage
├── /contact → ContactPage
├── /news → NewsPage
└── /report → ReportPage
```

### Admin Routes (AdminLayout)

```
/admin (AdminLayout)
├── /admin → DashboardPage
├── /admin/users → UsersPage
├── /admin/reports → ReportsPage
└── /admin/facilities → FacilitiesPage
```

---

## 📦 Component Organization Pattern

### 1. Feature-based Structure (Khuyên dùng)

Mỗi feature có thư mục riêng với đầy đủ components, api, hooks, types.

```
feature-name/
├── FeaturePage.tsx            # Main page
├── components/
│   ├── FeatureForm.tsx
│   ├── FeatureList.tsx
│   └── FeatureCard.tsx
├── api/
│   └── feature.api.ts
├── hooks/
│   └── use-feature.ts
└── types/
    └── feature.type.ts
```

**Ưu điểm:**

- Dễ tìm và quản lý code
- Dễ thêm/xóa feature
- Tách biệt rõ ràng giữa các modules

### 2. Export Pattern

**index.ts** trong thư mục `components/`:

```typescript
// components/index.ts
export { LoginDialog } from "./LoginDialog";
export { RegisterDialog } from "./RegisterDialog";
export { OTPDialog } from "./OTPDialog";
```

**Import:**

```typescript
// ✅ Good
import { LoginDialog, RegisterDialog } from "./components";

// ❌ Avoid
import LoginDialog from "./components/LoginDialog";
import RegisterDialog from "./components/RegisterDialog";
```

---

## 🛠️ Best Practices

### 1. Component Design

- **Single Responsibility**: Mỗi component chỉ làm một việc
- **Reusability**: Ưu tiên tái sử dụng, tránh duplicate code
- **Composition**: Dùng composition thay vì inheritance

### 2. State Management

- **Local state**: `useState` cho state đơn giản
- **Form state**: `react-hook-form` cho forms
- **Global state**: Context API hoặc Zustand/Redux

### 3. API Calls

- Tập trung trong `api/` folder
- Dùng custom hooks để gọi API
- Handle loading và error states

```typescript
// api/user.api.ts
export const getUserById = async (id: string) => {
  const response = await axios.get(`/users/${id}`);
  return response.data;
};

// hooks/use-user.ts
export const useUser = (id: string) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUserById(id)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { user, loading, error };
};
```

### 4. Styling

- Dùng **Tailwind CSS** cho utility classes
- Dùng **shadcn/ui** components trong `components/ui/`
- Tránh inline styles khi có thể

### 5. TypeScript

- Luôn định nghĩa types cho props
- Tránh dùng `any`, dùng `unknown` hoặc generic
- Export types để tái sử dụng

```typescript
// ✅ Good
interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose }) => {
  // ...
};

// ❌ Avoid
export const LoginDialog = ({ open, onClose }: any) => {
  // ...
};
```

---

## 🚀 Thêm Feature Mới

### Ví dụ: Thêm feature "Facility Management"

**1. Tạo cấu trúc thư mục:**

```bash
src/user/facilities/
├── FacilitiesPage.tsx
├── components/
│   ├── FacilityCard.tsx
│   ├── FacilityList.tsx
│   └── FacilityFilter.tsx
├── api/
│   └── facilities.api.ts
└── types/
    └── facility.type.ts
```

**2. Định nghĩa types:**

```typescript
// types/facility.type.ts
export interface Facility {
  id: string;
  name: string;
  location: string;
  status: "available" | "maintenance" | "unavailable";
}
```

**3. Tạo API calls:**

```typescript
// api/facilities.api.ts
import axios from "@/lib/axios";
import { Facility } from "../types/facility.type";

export const getFacilities = async (): Promise<Facility[]> => {
  const response = await axios.get("/facilities");
  return response.data;
};
```

**4. Tạo components:**

```typescript
// FacilitiesPage.tsx
export default function FacilitiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Facilities Management</h1>
      {/* Content */}
    </div>
  );
}
```

**5. Thêm route trong App.tsx:**

```typescript
// App.tsx
import FacilitiesPage from "./user/facilities/FacilitiesPage";

<Route path="/" element={<MainLayout />}>
  {/* ... existing routes */}
  <Route path="facilities" element={<FacilitiesPage />} />
</Route>;
```

**6. Thêm link trong navigation:**

```typescript
// components/AppBar.tsx
<Link to="/facilities">Cơ sở vật chất</Link>
```

---

## 📚 Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **Form**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: Sonner

---

## 📝 Notes

1. **Không commit `node_modules/`** - Đã được ignore trong `.gitignore`
2. **Environment variables** - Tạo file `.env.local` cho các biến môi trường
3. **Code formatting** - Chạy `npm run lint` trước khi commit
4. **Type checking** - Chạy `tsc --noEmit` để check types

---

## 🔗 Tài Liệu Tham Khảo

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript](https://www.typescriptlang.org)

---

**Cập nhật lần cuối**: 06/10/2025
