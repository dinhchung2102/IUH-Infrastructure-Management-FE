# Utils

Thư mục này chứa các utility functions và helper functions có thể tái sử dụng trong toàn bộ ứng dụng.

## Cấu trúc

```
utils/
└── README-vi.md          # File này
```

## Mô tả

Hiện tại thư mục này chưa có utility functions nào. Các utilities có thể được thêm vào trong tương lai:

### Ví dụ utilities có thể thêm:

#### validation.js
- **Chức năng**: Validation functions cho forms
- **Usage**:
```jsx
import { validateEmail, validatePassword } from '../utils/validation';

const isValidEmail = validateEmail(email);
const isValidPassword = validatePassword(password);
```

#### format.js
- **Chức năng**: Format data (date, currency, etc.)
- **Usage**:
```jsx
import { formatDate, formatCurrency } from '../utils/format';

const formattedDate = formatDate(date);
const formattedPrice = formatCurrency(price);
```

#### storage.js
- **Chức năng**: Local storage utilities
- **Usage**:
```jsx
import { getStorage, setStorage, removeStorage } from '../utils/storage';

setStorage('user', userData);
const user = getStorage('user');
removeStorage('user');
```

#### api.js
- **Chức năng**: API helper functions
- **Usage**:
```jsx
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';

const data = await apiGet('/users');
const result = await apiPost('/users', userData);
```

#### constants.js
- **Chức năng**: Application constants
- **Usage**:
```jsx
import { API_BASE_URL, THEME_MODES, LANGUAGES } from '../utils/constants';
```

## Quy tắc đặt tên

- Sử dụng camelCase cho tên file
- Sử dụng camelCase cho function names
- Thêm `.js` extension
- Sử dụng descriptive names

## Best Practices

1. **Pure Functions**: Utils nên là pure functions
2. **Testing**: Viết test cho tất cả utils
3. **Documentation**: Viết JSDoc cho functions
4. **Error Handling**: Xử lý lỗi phù hợp
5. **Performance**: Tối ưu performance khi cần

## Ví dụ tạo utility

```jsx
// utils/validation.js
/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result
 */
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    errors: {
      length: password.length < minLength,
      uppercase: !hasUpperCase,
      lowercase: !hasLowerCase,
      numbers: !hasNumbers,
      special: !hasSpecialChar
    }
  };
};
```

## Cấu trúc đề xuất

```
utils/
├── validation.js          # Form validation
├── format.js             # Data formatting
├── storage.js            # Local storage
├── api.js                # API helpers
├── constants.js          # App constants
├── helpers.js            # General helpers
└── README-vi.md         # File này
```

## Import patterns

```jsx
// Import specific functions
import { validateEmail } from '../utils/validation';

// Import all from module
import * as format from '../utils/format';

// Import default
import api from '../utils/api';
``` 