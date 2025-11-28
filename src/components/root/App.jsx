import React from "react";
import Navi from "../navi/Navi.jsx";
import { Container } from "reactstrap";
import Dashboard from "./Dashboard.jsx";
import { Route, Routes } from "react-router-dom";
import CartDetail from "../cart/CartDetail.jsx";
import AddOrUpdateProduct from "../products/AddOrUpdateProduct.jsx";
import ProductDetail from "../products/ProductDetail.jsx";
import Favorites from "../favorites/Favorites.jsx";
import NotFound from "../common/NotFound.jsx";

function App() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--light-bg)" }}>
      <Navi />
      <Container
        fluid
        style={{
          maxWidth: "1400px",
          padding: "2rem 1rem",
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/product" element={<Dashboard />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<CartDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route
            path="/saveproduct/:productId"
            element={<AddOrUpdateProduct />}
          />
          <Route path="/saveproduct" element={<AddOrUpdateProduct />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
