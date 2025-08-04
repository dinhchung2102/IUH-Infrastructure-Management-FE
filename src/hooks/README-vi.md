# Hooks

Thư mục này chứa các custom React hooks có thể tái sử dụng trong toàn bộ ứng dụng.

## Cấu trúc

```
hooks/
└── README-vi.md           # File này
```

## Mô tả

Hiện tại thư mục này chưa có custom hooks nào. Các hooks có thể được thêm vào trong tương lai:

### Ví dụ hooks có thể thêm:

#### useLocalStorage.js
- **Chức năng**: Quản lý localStorage với React state
- **Usage**: 
```jsx
const [value, setValue] = useLocalStorage('key', defaultValue);
```

#### useDebounce.js
- **Chức năng**: Debounce function calls
- **Usage**:
```jsx
const debouncedValue = useDebounce(value, 500);
```

#### useApi.js
- **Chức năng**: Quản lý API calls với loading/error states
- **Usage**:
```jsx
const { data, loading, error, refetch } = useApi('/api/endpoint');
```

#### useForm.js
- **Chức năng**: Quản lý form state và validation
- **Usage**:
```jsx
const { values, errors, handleChange, handleSubmit } = useForm(initialValues, validationSchema);
```

## Quy tắc đặt tên

- Sử dụng camelCase cho tên file
- Bắt đầu với `use` cho custom hooks
- Thêm `.js` extension

## Best Practices

1. **Naming**: Luôn bắt đầu với `use`
2. **Dependencies**: Sử dụng useCallback/useMemo khi cần
3. **Cleanup**: Sử dụng useEffect cleanup khi cần
4. **Testing**: Viết test cho custom hooks
5. **Documentation**: Viết JSDoc cho hooks

## Ví dụ tạo custom hook

```jsx
// useLocalStorage.js
import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};
```
