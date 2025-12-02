# Northwind E-Commerce Platform

A modern, full-featured e-commerce platform built with React, Redux, and Vite. This project demonstrates a complete online shopping experience with admin management capabilities, user authentication, order processing, and more.

## 🚀 Features

### Customer Features
- **Product Browsing**: Browse products by category, search, and filter
- **Product Details**: Detailed product pages with images, descriptions, and reviews
- **Shopping Cart**: Add products to cart, manage quantities, and proceed to checkout
- **Favorites**: Save favorite products for quick access
- **User Authentication**: Register and login system
- **Order History**: View past orders and track order status
- **Reviews & Ratings**: Write and read product reviews with star ratings
- **Coupon System**: Apply discount coupons at checkout

### Admin Features
- **Product Management**: Add, edit, and delete products
- **Order Management**: View all orders, update status, add notes, and delete orders
- **User Management**: Create, edit, and manage user accounts and roles
- **Coupon Management**: Create and manage discount coupons
- **Dashboard**: View statistics including total orders, revenue, products, and users
- **Review Management**: Delete inappropriate reviews

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0
- **State Management**: Redux 5.0.1, Redux Toolkit 2.11.0
- **Routing**: React Router DOM 7.9.6
- **UI Components**: Reactstrap 9.2.3, Bootstrap 5.3.8
- **Build Tool**: Vite (Rolldown)
- **Notifications**: AlertifyJS 1.14.0
- **Data Persistence**: localStorage

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nortwind-redux
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🎯 Default Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@northwind.com`

### Regular User Account
- **Username**: `user`
- **Password**: `user123`
- **Email**: `user@northwind.com`

## 📁 Project Structure

```
nortwind-redux/
├── src/
│   ├── components/
│   │   ├── admin/          # Admin management components
│   │   ├── auth/           # Authentication components
│   │   ├── cart/           # Shopping cart components
│   │   ├── categories/     # Category components
│   │   ├── checkout/       # Checkout process
│   │   ├── common/         # Shared components (Loading, Error, etc.)
│   │   ├── favorites/      # Favorites functionality
│   │   ├── home/           # Homepage components
│   │   ├── navi/           # Navigation bar
│   │   ├── orders/         # Order components
│   │   ├── products/       # Product components
│   │   └── root/           # Root/App component
│   ├── redux/
│   │   ├── actions/        # Redux actions
│   │   └── reducers/       # Redux reducers
│   ├── styles/             # CSS styles
│   └── main.jsx           # Application entry point
├── public/                 # Static assets
├── package.json
└── README.md
```

## 🔑 Key Features Explained

### State Management
- Uses Redux for centralized state management
- Redux Toolkit for modern Redux patterns
- Redux Thunk for asynchronous actions
- localStorage for data persistence

### Authentication
- Frontend-only authentication system
- Role-based access control (Admin/User)
- Session persistence using localStorage
- Protected routes for admin features

### Data Persistence
All data is stored in browser localStorage:
- Products
- Users
- Orders
- Cart items
- Favorites
- Reviews
- Coupons
- User profiles

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Mobile-friendly navigation
- Touch-optimized interactions

## 🎨 Design Philosophy

- **Minimalist**: Clean, modern interface inspired by Crate & Barrel
- **Professional**: Business-focused design with neutral color palette
- **User-Friendly**: Intuitive navigation and clear user feedback
- **Accessible**: Proper semantic HTML and keyboard navigation support

## 🚦 Available Scripts

- `npm run dev` - Start development server
- `npm start` - Start development server (alias)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Responsive Breakpoints

- **Mobile**: < 576px
- **Tablet**: 576px - 768px
- **Desktop**: > 768px
- **Large Desktop**: > 1200px

## 🔒 Security Notes

⚠️ **Important**: This is a frontend-only application for demonstration purposes. In a production environment, you should:

- Implement backend API with proper authentication
- Use secure session management (JWT tokens)
- Validate all inputs on the server side
- Implement proper database storage
- Add CSRF protection
- Use HTTPS
- Implement rate limiting

## 🐛 Error Handling

- Error boundaries for React error catching
- User-friendly error messages
- Retry mechanisms for failed operations
- Loading states for async operations

## 📝 Development Notes

- All components use React class components or functional components with hooks
- Redux actions use thunk middleware for async operations
- localStorage is used for all data persistence
- No backend API required - all data is stored locally

## 🤝 Contributing

This is a learning/demonstration project. Feel free to fork and modify for your own purposes.

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- Design inspiration from Crate & Barrel
- Built with modern React and Redux best practices
- Uses Vite for fast development experience

---

**Note**: This application stores all data in browser localStorage. Clearing browser data will reset all information. For production use, implement a proper backend API.
