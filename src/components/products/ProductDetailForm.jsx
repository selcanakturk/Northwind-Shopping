import React from "react";
import { Button, Form, FormGroup, Label, Input, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

export default function ProductDetailForm({
  product,
  categories,
  onChange,
  onSave,
  errors,
}) {
  return (
    <div style={{ padding: "3rem 0" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link
          to="/"
          style={{
            color: "#6b7280",
            textDecoration: "none",
            fontSize: "0.875rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "1rem",
            display: "inline-block",
          }}
        >
          ← Back to Products
        </Link>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "300",
            letterSpacing: "2px",
            color: "#1a1a1a",
            marginTop: "1rem",
            marginBottom: "0.5rem",
          }}
        >
          {product.id ? "Update Product" : "Add New Product"}
        </h1>
        <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
          {product.id
            ? "Update product information below"
            : "Fill in the details to add a new product"}
        </p>
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          backgroundColor: "#ffffff",
          padding: "2.5rem",
        }}
      >
        <Form onSubmit={onSave}>
          <Row>
            <Col md="12">
              <FormGroup>
                <Label
                  for="productName"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#1a1a1a",
                    marginBottom: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Product Name <span style={{ color: "#ef4444" }}>*</span>
                </Label>
                <Input
                  type="text"
                  name="productName"
                  id="productName"
                  value={product.productName || ""}
                  onChange={onChange}
                  style={{
                    border: errors.productName
                      ? "1px solid #ef4444"
                      : "1px solid #e5e7eb",
                    borderRadius: "0",
                    padding: "0.875rem 1rem",
                    fontSize: "0.875rem",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1a1a1a";
                    e.target.style.boxShadow = "0 0 0 1px #1a1a1a";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.productName
                      ? "#ef4444"
                      : "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="Enter product name"
                />
                {errors.productName && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "0.75rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {errors.productName}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md="6">
              <FormGroup>
                <Label
                  for="categoryId"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#1a1a1a",
                    marginBottom: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Category <span style={{ color: "#ef4444" }}>*</span>
                </Label>
                <Input
                  type="select"
                  name="categoryId"
                  id="categoryId"
                  value={product.categoryId || ""}
                  onChange={onChange}
                  style={{
                    border: errors.categoryId
                      ? "1px solid #ef4444"
                      : "1px solid #e5e7eb",
                    borderRadius: "0",
                    padding: "0.875rem 1rem",
                    fontSize: "0.875rem",
                    backgroundColor: "#ffffff",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1a1a1a";
                    e.target.style.boxShadow = "0 0 0 1px #1a1a1a";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.categoryId
                      ? "#ef4444"
                      : "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="">Select a category</option>
                  {categories &&
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
                </Input>
                {errors.categoryId && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "0.75rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {errors.categoryId}
                  </div>
                )}
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label
                  for="unitPrice"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#1a1a1a",
                    marginBottom: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Unit Price ($) <span style={{ color: "#ef4444" }}>*</span>
                </Label>
                <Input
                  type="number"
                  name="unitPrice"
                  id="unitPrice"
                  value={product.unitPrice || ""}
                  onChange={onChange}
                  min="0"
                  step="0.01"
                  style={{
                    border: errors.unitPrice
                      ? "1px solid #ef4444"
                      : "1px solid #e5e7eb",
                    borderRadius: "0",
                    padding: "0.875rem 1rem",
                    fontSize: "0.875rem",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1a1a1a";
                    e.target.style.boxShadow = "0 0 0 1px #1a1a1a";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.unitPrice
                      ? "#ef4444"
                      : "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="0.00"
                />
                {errors.unitPrice && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "0.75rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {errors.unitPrice}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md="6">
              <FormGroup>
                <Label
                  for="quantityPerUnit"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#1a1a1a",
                    marginBottom: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Quantity Per Unit <span style={{ color: "#ef4444" }}>*</span>
                </Label>
                <Input
                  type="text"
                  name="quantityPerUnit"
                  id="quantityPerUnit"
                  value={product.quantityPerUnit || ""}
                  onChange={onChange}
                  style={{
                    border: errors.quantityPerUnit
                      ? "1px solid #ef4444"
                      : "1px solid #e5e7eb",
                    borderRadius: "0",
                    padding: "0.875rem 1rem",
                    fontSize: "0.875rem",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1a1a1a";
                    e.target.style.boxShadow = "0 0 0 1px #1a1a1a";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.quantityPerUnit
                      ? "#ef4444"
                      : "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="e.g., 24 boxes"
                />
                {errors.quantityPerUnit && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "0.75rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {errors.quantityPerUnit}
                  </div>
                )}
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label
                  for="unitsInStock"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#1a1a1a",
                    marginBottom: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Units In Stock <span style={{ color: "#ef4444" }}>*</span>
                </Label>
                <Input
                  type="number"
                  name="unitsInStock"
                  id="unitsInStock"
                  value={product.unitsInStock || ""}
                  onChange={onChange}
                  min="0"
                  step="1"
                  style={{
                    border: errors.unitsInStock
                      ? "1px solid #ef4444"
                      : "1px solid #e5e7eb",
                    borderRadius: "0",
                    padding: "0.875rem 1rem",
                    fontSize: "0.875rem",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1a1a1a";
                    e.target.style.boxShadow = "0 0 0 1px #1a1a1a";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.unitsInStock
                      ? "#ef4444"
                      : "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="0"
                />
                {errors.unitsInStock && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "0.75rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {errors.unitsInStock}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md="12">
              <FormGroup>
                <Label
                  for="imageUrl"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#1a1a1a",
                    marginBottom: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Image URL
                </Label>
                <Input
                  type="url"
                  name="imageUrl"
                  id="imageUrl"
                  value={product.imageUrl || ""}
                  onChange={onChange}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "0",
                    padding: "0.875rem 1rem",
                    fontSize: "0.875rem",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1a1a1a";
                    e.target.style.boxShadow = "0 0 0 1px #1a1a1a";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="https://example.com/image.jpg"
                />
                <div
                  style={{
                    color: "#6b7280",
                    fontSize: "0.75rem",
                    marginTop: "0.5rem",
                  }}
                >
                  Optional: Enter a URL for the product image
                </div>
              </FormGroup>
            </Col>
          </Row>

          <div
            style={{
              marginTop: "2.5rem",
              paddingTop: "2rem",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              gap: "1rem",
              justifyContent: "flex-end",
            }}
          >
            <Link
              to="/"
              style={{
                padding: "0.875rem 2rem",
                border: "1px solid #e5e7eb",
                color: "#1a1a1a",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                transition: "all 0.2s ease",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "#1a1a1a";
                e.target.style.backgroundColor = "#f9fafb";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.backgroundColor = "transparent";
              }}
            >
              Cancel
            </Link>
            <Button
              type="submit"
              style={{
                padding: "0.875rem 2rem",
                backgroundColor: "#1a1a1a",
                color: "#ffffff",
                border: "none",
                borderRadius: "0",
                fontSize: "0.875rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                transition: "background-color 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#000000")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#1a1a1a")}
            >
              {product.id ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
