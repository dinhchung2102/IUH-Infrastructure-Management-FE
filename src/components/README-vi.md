# Components

Thư mục này chứa các component UI có thể tái sử dụng trong toàn bộ ứng dụng.

## Cấu trúc

```
components/
├── LanguageSwitcher.jsx    # Component chuyển đổi ngôn ngữ
├── ThemeSwitcher.jsx       # Component chuyển đổi theme
└── README-vi.md           # File này
```

## Mô tả các component

### LanguageSwitcher.jsx
- **Chức năng**: Chuyển đổi giữa các ngôn ngữ (Tiếng Việt, Tiếng Anh)
- **Props**: Không có
- **Features**: 
  - Dropdown menu với flag icons
  - Auto-detect ngôn ngữ từ browser
  - Persistent language preference
  - Translation support

### ThemeSwitcher.jsx
- **Chức năng**: Chuyển đổi giữa các theme (Light, Dark, System)
- **Props**: Không có
- **Features**:
  - Dropdown menu với theme icons
  - Real-time theme switching
  - System theme detection
  - Persistent theme preference

## Quy tắc đặt tên

- Sử dụng PascalCase cho tên component
- Sử dụng camelCase cho tên file
- Thêm `.jsx` extension cho React components

## Cách sử dụng

```jsx
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeSwitcher from '../components/ThemeSwitcher';

// Trong component
<LanguageSwitcher />
<ThemeSwitcher />
```

## Best Practices

1. **Reusability**: Tạo component có thể tái sử dụng
2. **Props**: Sử dụng props để customize component
3. **TypeScript**: Cân nhắc sử dụng TypeScript cho type safety
4. **Testing**: Viết test cho các component quan trọng
5. **Documentation**: Comment code và viết JSDoc
