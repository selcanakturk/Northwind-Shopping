import React from "react";
import Navi from "../navi/Navi.jsx";
import { Container } from "reactstrap";
import Dashboard from "./Dashboard.jsx";
import { Route, Routes } from "react-router-dom";
import CartDetail from "../cart/CartDetail.jsx";
import AddOrUpdateProduct from "../products/AddOrUpdateProduct.jsx";
import ProductDetail from "../products/ProductDetail.jsx";
import Favorites from "../favorites/Favorites.jsx";
import Checkout from "../checkout/Checkout.jsx";
import Login from "../auth/Login.jsx";
import Account from "../account/Account.jsx";
import CouponManagement from "../admin/CouponManagement.jsx";
import OrderManagement from "../admin/OrderManagement.jsx";
import UserManagement from "../admin/UserManagement.jsx";
import OrderDetail from "../orders/OrderDetail.jsx";
import NotFound from "../common/NotFound.jsx";
import ErrorBoundary from "../common/ErrorBoundary.jsx";

function App() {
  return (
    <ErrorBoundary>
      <div style={{ minHeight: "100vh", background: "var(--light-bg)" }}>
        <Navi />
        <Container
          fluid
          style={{
            maxWidth: "1400px",
            padding: "2rem 1rem",
          }}
        >
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/product" element={<Dashboard />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/cart" element={<CartDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/login" element={<Login />} />
              <Route path="/account" element={<Account />} />
              <Route path="/order/:orderId" element={<OrderDetail />} />
              <Route path="/admin/coupons" element={<CouponManagement />} />
              <Route path="/admin/orders" element={<OrderManagement />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route
                path="/saveproduct/:productId"
                element={<AddOrUpdateProduct />}
              />
              <Route path="/saveproduct" element={<AddOrUpdateProduct />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </Container>
      </div>
    </ErrorBoundary>
  );
}

export default App;
