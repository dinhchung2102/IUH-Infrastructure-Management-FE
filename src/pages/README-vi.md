# Pages

Thư mục này chứa các page components - các trang chính của ứng dụng.

## Cấu trúc

```
pages/
├── HomePage.jsx           # Trang chủ
├── ErrorPage.jsx          # Trang lỗi 500
├── NotFoundPage.jsx       # Trang 404
└── README-vi.md          # File này
```

## Mô tả các pages

### HomePage.jsx
- **Route**: `/` (index route)
- **Chức năng**: Trang chủ với welcome message và feature cards
- **Components**:
  - Welcome title và subtitle
  - 3 feature cards: Dashboard, Infrastructure, Reports
  - Responsive grid layout
- **Features**:
  - Multi-language support
  - Theme-aware styling
  - Responsive design
  - Navigation buttons đến các trang khác

### ErrorPage.jsx
- **Route**: `/error`
- **Chức năng**: Hiển thị khi có lỗi server (500)
- **Components**:
  - Error title (500)
  - Error message
  - "Go to Home" button
- **Features**:
  - User-friendly error message
  - Easy navigation back to home

### NotFoundPage.jsx
- **Route**: `/*` (catch-all route)
- **Chức năng**: Hiển thị khi trang không tồn tại (404)
- **Components**:
  - 404 title
  - "Page not found" message
  - "Go to Home" button
- **Features**:
  - Clear 404 indication
  - Easy navigation back to home

## Quy tắc đặt tên

- Sử dụng PascalCase cho tên component
- Thêm `Page` suffix cho page components
- Sử dụng `.jsx` extension

## Cách sử dụng

```jsx
// Trong App.jsx hoặc router
<Route index element={<HomePage />} />
<Route path="error" element={<ErrorPage />} />
<Route path="*" element={<NotFoundPage />} />
```

## Best Practices

1. **Single Responsibility**: Mỗi page chỉ có một chức năng chính
2. **SEO Friendly**: Sử dụng semantic HTML và meta tags
3. **Performance**: Lazy load pages khi cần
4. **Accessibility**: Tuân thủ WCAG guidelines
5. **Error Handling**: Có error boundaries cho pages

## Thêm page mới

Khi thêm page mới:

```jsx
// DashboardPage.jsx
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { t } = useTranslation();
  
  return (
    <Box>
      <Typography variant="h3">
        {t('dashboard.title')}
      </Typography>
      {/* Page content */}
    </Box>
  );
}
```

## Routing Structure

```
/                    → HomePage
/login              → LoginPage (trong modules/auth)
/register           → RegisterPage (trong modules/auth)
/error              → ErrorPage
/*                  → NotFoundPage
```

## Future Pages

Các pages có thể thêm trong tương lai:
- `DashboardPage.jsx` - Bảng điều khiển
- `InfrastructurePage.jsx` - Quản lý hạ tầng
- `ReportsPage.jsx` - Báo cáo
- `SettingsPage.jsx` - Cài đặt
- `ProfilePage.jsx` - Hồ sơ người dùng
