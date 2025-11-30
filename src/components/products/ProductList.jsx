import React, { Component } from "react";
import { connect } from "react-redux";
import { Badge, Button, Input, InputGroup, InputGroupText } from "reactstrap";
import { bindActionCreators } from "redux";
import * as productActions from "../../redux/actions/productActions.jsx";
import * as cartActions from "../../redux/actions/cartActions.jsx";
import alertify from "alertifyjs";
import { Link } from "react-router-dom";

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      sortBy: "name",
      showSaleOnly: false,
    };
  }

  componentDidMount() {
    this.props.actions.getProducts();

    window.addEventListener("searchProducts", this.handleExternalSearch);
    window.addEventListener("filterSale", this.handleSaleFilter);
  }

  componentWillUnmount() {
    window.removeEventListener("searchProducts", this.handleExternalSearch);
    window.removeEventListener("filterSale", this.handleSaleFilter);
  }

  handleExternalSearch = (event) => {
    if (event.detail && event.detail.searchTerm) {
      this.setState({ searchTerm: event.detail.searchTerm });
    }
  };

  handleSaleFilter = () => {
    this.setState({ showSaleOnly: true, sortBy: "price-asc" });
  };

  addToCart = (product) => {
    this.props.actions.addToCart({ quantity: 1, product });
    alertify.success(product.productName + " added to cart.");
  };

  handleDeleteProduct = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    alertify.confirm(
      "Delete Product",
      `Are you sure you want to delete "${product.productName}"? This action cannot be undone.`,
      () => {
        this.props.actions.deleteProduct(product.id);
      },
      () => {
        alertify.error("Deletion cancelled.");
      }
    );
  };

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleSortChange = (e) => {
    this.setState({ sortBy: e.target.value });
  };

  getFilteredAndSortedProducts = () => {
    const productsData = this.props.products?.data || this.props.products || [];
    let products = Array.isArray(productsData) ? productsData : [];

    if (this.state.searchTerm) {
      products = products.filter((product) =>
        product.productName
          .toLowerCase()
          .includes(this.state.searchTerm.toLowerCase())
      );
    }

    if (this.state.showSaleOnly) {
      const avgPrice = products.reduce((sum, p) => sum + (parseFloat(p.unitPrice) || 0), 0) / (products.length || 1);
      products = products.filter((product) => {
        const price = parseFloat(product.unitPrice) || 0;
        return price < avgPrice;
      });
    }

    const sortedProducts = [...products];
    switch (this.state.sortBy) {
      case "price-asc":
        sortedProducts.sort((a, b) => {
          const priceA = parseFloat(a.unitPrice) || 0;
          const priceB = parseFloat(b.unitPrice) || 0;
          return priceA - priceB;
        });
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => {
          const priceA = parseFloat(a.unitPrice) || 0;
          const priceB = parseFloat(b.unitPrice) || 0;
          return priceB - priceA;
        });
        break;
      case "name":
      default:
        sortedProducts.sort((a, b) =>
          a.productName.localeCompare(b.productName)
        );
        break;
    }

    return sortedProducts;
  };

  render() {
    const { products } = this.props;
    const isLoading = products?.loading || false;
    const error = products?.error || null;
    const filteredProducts = this.getFilteredAndSortedProducts();

    if (isLoading) {
      return (
        <div className="text-center py-5">
          <div className="modern-spinner mx-auto"></div>
          <p className="mt-3" style={{ color: "var(--text-secondary)" }}>
            Loading products...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="modern-card p-4">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Hata!</h4>
            <p>{error}</p>
          </div>
        </div>
      );
    }

    const getStockStatus = (stock) => {
      if (stock > 20) return "in-stock";
      if (stock > 0) return "low-stock";
      return "out-of-stock";
    };

    const getStockText = (stock) => {
      if (stock > 20) return "In Stock";
      if (stock > 0) return "Low Stock";
      return "Out of Stock";
    };

    return (
      <div>
        <div className="section-header">
          <h2 className="section-title">
            {this.state.showSaleOnly
              ? "Sale"
              : this.props.currentCategory.categoryName
                ? this.props.currentCategory.categoryName
                : "All Products"}
          </h2>
          <span className="modern-badge badge-primary-modern">
            {filteredProducts.length} products
          </span>
        </div>

        <div className="modern-search-container">
          <div className="row g-3">
            <div className="col-md-8">
              <InputGroup>
                <Input
                  className="modern-input"
                  type="text"
                  placeholder="Search products..."
                  value={this.state.searchTerm}
                  onChange={this.handleSearchChange}
                />
                <InputGroupText
                  style={{
                    background: "#ffffff",
                    border: "1px solid var(--border-color)",
                    borderLeft: "none",
                    cursor: "pointer",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 14L11.1 11.1"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </InputGroupText>
              </InputGroup>
            </div>
            <div className="col-md-4">
              <Input
                className="modern-input"
                type="select"
                value={this.state.sortBy}
                onChange={this.handleSortChange}
              >
                <option value="name">Sort by Name (A-Z)</option>
                <option value="price-asc">Sort by Price (Low-High)</option>
                <option value="price-desc">Sort by Price (High-Low)</option>
              </Input>
            </div>
          </div>
        </div>

        {filteredProducts && filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <Link
                  to={"/product/" + product.id}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                  }}
                >
                  <div className="product-card-image" style={{ position: "relative" }}>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.productName}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          const placeholder = e.target.parentElement.querySelector(".image-placeholder");
                          if (placeholder) {
                            placeholder.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className="image-placeholder"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: product.imageUrl ? "none" : "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#9ca3af",
                        fontSize: "0.875rem",
                        fontWeight: "400",
                        backgroundColor: "#f0f0f0",
                      }}
                    >
                      Product Image
                    </div>
                  </div>
                  <div className="product-card-body">
                    <h3 className="product-card-title">
                      {product.productName}
                    </h3>
                    <div className="product-card-price">
                      ${parseFloat(product.unitPrice || 0).toFixed(2)}
                    </div>
                    <span
                      className={`product-card-stock ${getStockStatus(
                        product.unitsInStock
                      )}`}
                    >
                      {getStockText(product.unitsInStock)} ({product.unitsInStock})
                    </span>
                  </div>
                </Link>
                <div style={{ padding: "0 1.5rem 1.5rem 1.5rem" }}>
                  {this.props.auth?.isAuthenticated && this.props.auth?.user?.role === "admin" ? (
                    <Button
                      className="btn-modern w-100"
                      onClick={(e) => this.handleDeleteProduct(product, e)}
                      style={{
                        backgroundColor: "transparent",
                        color: "#6b7280",
                        border: "1px solid #e5e7eb",
                        padding: "0.75rem 1rem",
                        fontSize: "0.875rem",
                        fontWeight: "400",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = "#ef4444";
                        e.target.style.color = "#ef4444";
                        e.target.style.backgroundColor = "#fef2f2";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = "#e5e7eb";
                        e.target.style.color = "#6b7280";
                        e.target.style.backgroundColor = "transparent";
                      }}
                    >
                      Delete
                    </Button>
                  ) : (
                    <Button
                      className="btn-modern w-100"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.addToCart(product);
                      }}
                      disabled={product.unitsInStock === 0}
                    >
                      {product.unitsInStock > 0 ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No Products Found</h3>
            <p>
              {filteredProducts.length === 0 &&
                (this.props.products?.data || this.props.products || []).length >
                0
                ? "No products match your search criteria."
                : "No products available."}
            </p>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentCategory: state.changeCategoryReducer,
    products: state.productListReducer,
    auth: state.authReducer,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: {
      getProducts: bindActionCreators(productActions.getProducts, dispatch),
      addToCart: bindActionCreators(cartActions.addToCart, dispatch),
      deleteProduct: bindActionCreators(productActions.deleteProduct, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
