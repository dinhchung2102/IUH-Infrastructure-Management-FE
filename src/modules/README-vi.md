# Modules

Thư mục này chứa các module chức năng của ứng dụng, được tổ chức theo tính năng.

## Cấu trúc

```
modules/
├── auth/                  # Module xác thực
│   ├── components/        # Auth components
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── pages/            # Auth pages
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── hooks/            # Auth hooks (future)
│   └── utils/            # Auth utilities (future)
├── example/              # Module ví dụ
│   └── index.js
└── README-vi.md         # File này
```

## Mô tả các modules

### auth/
Module xử lý xác thực người dùng (đăng nhập, đăng ký, quản lý session).

#### Components:
- **LoginForm.jsx**: Form đăng nhập với email/password
- **RegisterForm.jsx**: Form đăng ký với đầy đủ thông tin

#### Pages:
- **LoginPage.jsx**: Trang đăng nhập
- **RegisterPage.jsx**: Trang đăng ký

#### Features:
- Form validation
- Password visibility toggle
- Multi-language support
- Theme-aware styling
- Responsive design

### example/
Module ví dụ để tham khảo cấu trúc.

## Quy tắc tổ chức module

### Cấu trúc chuẩn cho mỗi module:
```
module-name/
├── components/           # UI components của module
├── pages/               # Page components
├── hooks/               # Custom hooks
├── utils/               # Utility functions
├── services/            # API services
├── types/               # TypeScript types (nếu có)
└── index.js             # Module exports
```

### Quy tắc đặt tên:
- Sử dụng kebab-case cho tên thư mục module
- Sử dụng PascalCase cho component names
- Sử dụng camelCase cho file names

## Cách sử dụng

### Import từ module:
```jsx
// Import pages
import LoginPage from '../modules/auth/pages/LoginPage';
import RegisterPage from '../modules/auth/pages/RegisterPage';

// Import components
import LoginForm from '../modules/auth/components/LoginForm';
import RegisterForm from '../modules/auth/components/RegisterForm';
```

### Module exports (index.js):
```jsx
// modules/auth/index.js
export { default as LoginPage } from './pages/LoginPage';
export { default as RegisterPage } from './pages/RegisterPage';
export { default as LoginForm } from './components/LoginForm';
export { default as RegisterForm } from './components/RegisterForm';
```

## Best Practices

1. **Separation of Concerns**: Mỗi module chỉ xử lý một tính năng
2. **Encapsulation**: Logic của module nên được đóng gói
3. **Reusability**: Components có thể tái sử dụng
4. **Testing**: Viết test cho từng module
5. **Documentation**: Mỗi module nên có README riêng

## Thêm module mới

Khi thêm module mới (ví dụ: dashboard):

```bash
modules/
├── dashboard/
│   ├── components/
│   │   ├── DashboardCard.jsx
│   │   └── DashboardChart.jsx
│   ├── pages/
│   │   └── DashboardPage.jsx
│   ├── hooks/
│   │   └── useDashboardData.js
│   ├── services/
│   │   └── dashboardApi.js
│   └── index.js
```

## Future Modules

Các modules có thể thêm trong tương lai:
- **dashboard/**: Bảng điều khiển và thống kê
- **infrastructure/**: Quản lý hạ tầng
- **reports/**: Báo cáo và analytics
- **settings/**: Cài đặt hệ thống
- **users/**: Quản lý người dùng
- **notifications/**: Thông báo
