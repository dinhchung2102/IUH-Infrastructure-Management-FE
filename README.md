# IUH Infrastructure Management Frontend

Hệ thống quản lý hạ tầng IUH - Frontend Application

## 🚀 Tính năng

- **🎨 Material-UI (MUI)**: UI framework hiện đại và responsive
- **🌙 Theme Support**: Light/Dark/System theme với real-time switching
- **🌍 Multi-language**: Hỗ trợ Tiếng Việt và Tiếng Anh
- **📱 Responsive Design**: Tối ưu cho mọi thiết bị
- **⚡ React Router**: Client-side routing
- **🔧 Modern Stack**: React 18 + Vite + ESLint

## 🛠️ Tech Stack

- **React 18** - UI Library
- **Vite** - Build tool và dev server
- **Material-UI (MUI)** - UI Components
- **React Router DOM** - Client-side routing
- **React i18next** - Internationalization
- **Emotion** - CSS-in-JS styling

## 📁 Cấu trúc Project

```
src/
├── components/           # Reusable UI components
│   ├── LanguageSwitcher.jsx
│   └── ThemeSwitcher.jsx
├── layouts/             # Layout components
│   └── MainLayout.jsx
├── pages/               # Page components
│   ├── HomePage.jsx
│   ├── ErrorPage.jsx
│   └── NotFoundPage.jsx
├── modules/             # Feature modules
│   └── auth/           # Authentication module
│       ├── components/
│       └── pages/
├── providers/           # Context providers
│   ├── ThemeContext.jsx
│   └── ThemeProvider.jsx
├── theme/              # MUI theme configuration
│   └── index.js
├── i18n/               # Internationalization
│   ├── index.js
│   └── locales/
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── assets/             # Static assets
    └── logo/
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm hoặc yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd IUH-Infrastructure-Management-FE

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## 📖 Documentation

Mỗi thư mục có file `README-vi.md` riêng với hướng dẫn chi tiết:

- [Components Documentation](src/components/README-vi.md)
- [Layouts Documentation](src/layouts/README-vi.md)
- [Pages Documentation](src/pages/README-vi.md)
- [Modules Documentation](src/modules/README-vi.md)
- [Hooks Documentation](src/hooks/README-vi.md)
- [Utils Documentation](src/utils/README-vi.md)

## 🎯 Features

### Authentication

- ✅ Login/Register forms
- ✅ Form validation
- ✅ Password visibility toggle
- ✅ Multi-language support

### Theme System

- ✅ Light/Dark/System themes
- ✅ Real-time theme switching
- ✅ Persistent theme preference
- ✅ System theme detection

### Internationalization

- ✅ Vietnamese (vi) and English (en)
- ✅ Language switcher component
- ✅ Persistent language preference
- ✅ Auto-detect browser language

### Layout & Navigation

- ✅ Responsive AppBar
- ✅ Navigation menu
- ✅ Sticky footer
- ✅ Scroll support for long content

## 🔧 Development

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Style

- ESLint configuration
- Prettier formatting
- Consistent naming conventions

## 📱 Responsive Design

Ứng dụng được thiết kế responsive cho:

- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🌟 Best Practices

- **Component Architecture**: Modular và reusable components
- **State Management**: React Context API cho global state
- **Performance**: Lazy loading và code splitting
- **Accessibility**: WCAG guidelines compliance
- **SEO**: Semantic HTML và meta tags

## 🔮 Roadmap

### Phase 1 (Current)

- ✅ Basic setup và routing
- ✅ Theme system
- ✅ Multi-language support
- ✅ Authentication UI

### Phase 2 (Next)

- 🔄 Dashboard module
- 🔄 Infrastructure management
- 🔄 Reports và analytics
- 🔄 User management

### Phase 3 (Future)

- 🔄 Advanced features
- 🔄 API integration
- 🔄 Real-time updates
- 🔄 Advanced analytics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **IUH Development Team**
- **Infrastructure Management System**

---

**IUH Infrastructure Management Frontend** - Modern React application for infrastructure management at IUH.
