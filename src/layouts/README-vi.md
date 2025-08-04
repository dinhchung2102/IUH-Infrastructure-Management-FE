# Layouts

Thư mục này chứa các layout components định nghĩa cấu trúc chung của ứng dụng.

## Cấu trúc

```
layouts/
├── MainLayout.jsx         # Layout chính của ứng dụng
└── README-vi.md          # File này
```

## Mô tả các layout

### MainLayout.jsx

- **Chức năng**: Layout chính bao gồm header, navigation, content area và footer
- **Components**:
  - **Header**: AppBar với navigation và logo
  - **Navigation**: Home, Login, Register buttons
  - **Theme Switcher**: Chuyển đổi light/dark/system theme
  - **Language Switcher**: Chuyển đổi ngôn ngữ
  - **Content Area**: Container cho các page content
  - **Footer**: Copyright information

#### Features:

- **Responsive Design**: Tự động điều chỉnh theo kích thước màn hình
- **Theme Support**: Hỗ trợ light/dark theme
- **Multi-language**: Hỗ trợ đa ngôn ngữ
- **Scroll Support**: Có scroll khi content dài
- **Sticky Footer**: Footer luôn ở dưới cùng

#### Structure:

```jsx
<Box>
  <AppBar>          {/* Header với navigation */}
    <Toolbar>
      <Typography>   {/* App title */}
      <Buttons>      {/* Navigation buttons */}
      <ThemeSwitcher />
      <LanguageSwitcher />
    </Toolbar>
  </AppBar>

  <Container>        {/* Main content area */}
    <Outlet />       {/* Page content */}
  </Container>

  <Box>             {/* Footer */}
    <Typography>    {/* Copyright */}
  </Box>
</Box>
```

## Quy tắc đặt tên

- Sử dụng PascalCase cho tên component
- Thêm `Layout` suffix cho layout components
- Sử dụng `.jsx` extension

## Cách sử dụng

```jsx
// Trong App.jsx
<Route path="/" element={<MainLayout />}>
  <Route index element={<HomePage />} />
  <Route path="login" element={<LoginPage />} />
</Route>
```

## Best Practices

1. **Consistency**: Giữ layout nhất quán trong toàn app
2. **Responsive**: Đảm bảo responsive trên mọi thiết bị
3. **Accessibility**: Tuân thủ WCAG guidelines
4. **Performance**: Tối ưu re-renders
5. **Flexibility**: Cho phép customize khi cần

## Thêm layout mới

Khi cần thêm layout mới (ví dụ: AdminLayout, AuthLayout):

```jsx
// AdminLayout.jsx
export default function AdminLayout() {
  return (
    <Box>
      <AdminHeader />
      <AdminSidebar />
      <Container>
        <Outlet />
      </Container>
    </Box>
  );
}
```
