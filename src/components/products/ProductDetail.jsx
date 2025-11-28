import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button, Row, Col } from "reactstrap";
import * as productActions from "../../redux/actions/productActions.jsx";
import * as cartActions from "../../redux/actions/cartActions.jsx";
import * as favoriteActions from "../../redux/actions/favoriteActions.jsx";
import alertify from "alertifyjs";

function ProductDetailWrapper(props) {
  const { productId } = useParams();
  const navigate = useNavigate();
  return <ProductDetail {...props} productId={productId} navigate={navigate} />;
}

class ProductDetail extends Component {
  componentDidMount() {
    this.props.actions.getProducts();
  }

  addToCart = (product) => {
    this.props.actions.addToCart({ quantity: 1, product });
    alertify.success(product.productName + " added to cart.");
  };

  toggleFavorite = (product) => {
    const favorites = this.props.favorites || [];
    const isFavorite = favorites.some((fav) => fav.id === product.id);
    if (isFavorite) {
      this.props.actions.removeFromFavorites(product.id);
      alertify.error(product.productName + " removed from favorites.");
    } else {
      this.props.actions.addToFavorites(product);
      alertify.success(product.productName + " added to favorites.");
    }
  };

  isFavorite = (productId) => {
    const favorites = this.props.favorites || [];
    return favorites.some((fav) => fav.id === productId);
  };

  getProductById = () => {
    const productsData = this.props.products?.data || this.props.products || [];
    const products = Array.isArray(productsData) ? productsData : [];
    const productId = parseInt(this.props.productId, 10);
    return products.find((p) => p.id === productId);
  };

  render() {
    const product = this.getProductById();
    const isLoading = this.props.products?.loading || false;

    if (isLoading) {
      return (
        <div className="text-center py-5">
          <div className="modern-spinner mx-auto"></div>
          <p className="mt-3" style={{ color: "var(--text-secondary)" }}>
            Loading product...
          </p>
        </div>
      );
    }

    if (!product) {
      return (
        <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "300", marginBottom: "1rem" }}>
            Product Not Found
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
            The product you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            style={{
              display: "inline-block",
              padding: "0.75rem 2rem",
              backgroundColor: "#1a1a1a",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Back to Home
          </Link>
        </div>
      );
    }

    const getStockStatus = (stock) => {
      if (stock > 20) return { text: "In Stock", class: "in-stock" };
      if (stock > 0) return { text: "Low Stock", class: "low-stock" };
      return { text: "Out of Stock", class: "out-of-stock" };
    };

    const stockStatus = getStockStatus(product.unitsInStock || 0);

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
            }}
          >
            ← Back to Products
          </Link>
        </div>

        <Row>
          <Col md="6" style={{ marginBottom: "2rem" }}>
            <div
              style={{
                width: "100%",
                aspectRatio: "1",
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div style={{ color: "#9ca3af", fontSize: "1rem" }}>
                  No Image Available
                </div>
              )}
            </div>
          </Col>

          <Col md="6">
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1rem",
                }}
              >
                <h1
                  style={{
                    fontSize: "2rem",
                    fontWeight: "300",
                    letterSpacing: "1px",
                    color: "#1a1a1a",
                    margin: "0",
                    flex: 1,
                  }}
                >
                  {product.productName}
                </h1>
                <button
                  onClick={() => this.toggleFavorite(product)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                  }}
                  title={
                    this.isFavorite(product.id)
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={this.isFavorite(product.id) ? "#ef4444" : "none"}
                    stroke={this.isFavorite(product.id) ? "#ef4444" : "#9ca3af"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transition: "fill 0.2s ease, stroke 0.2s ease",
                    }}
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <span
                  className={`product-card-stock ${stockStatus.class}`}
                  style={{
                    display: "inline-block",
                    padding: "0.5rem 1rem",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    marginBottom: "1rem",
                  }}
                >
                  {stockStatus.text}
                </span>
              </div>

              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  marginBottom: "2rem",
                }}
              >
                ${parseFloat(product.unitPrice || 0).toFixed(2)}
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#1a1a1a",
                    marginBottom: "0.75rem",
                  }}
                >
                  Product Details
                </h3>
                <div
                  style={{
                    borderTop: "1px solid #e5e7eb",
                    borderBottom: "1px solid #e5e7eb",
                    padding: "1.5rem 0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.75rem 0",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                      Quantity Per Unit:
                    </span>
                    <span
                      style={{
                        color: "#1a1a1a",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                      }}
                    >
                      {product.quantityPerUnit || "N/A"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.75rem 0",
                    }}
                  >
                    <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                      Units In Stock:
                    </span>
                    <span
                      style={{
                        color: "#1a1a1a",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                      }}
                    >
                      {product.unitsInStock || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <Button
                  onClick={() => this.addToCart(product)}
                  disabled={!product.unitsInStock || product.unitsInStock === 0}
                  style={{
                    width: "100%",
                    padding: "1rem 2rem",
                    backgroundColor: product.unitsInStock > 0 ? "#1a1a1a" : "#9ca3af",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    cursor: product.unitsInStock > 0 ? "pointer" : "not-allowed",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (product.unitsInStock > 0) {
                      e.target.style.backgroundColor = "#000000";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (product.unitsInStock > 0) {
                      e.target.style.backgroundColor = "#1a1a1a";
                    }
                  }}
                >
                  {product.unitsInStock > 0
                    ? "Add to Cart"
                    : "Out of Stock"}
                </Button>
              </div>

              <div
                style={{
                  padding: "1.5rem",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  marginBottom: "2rem",
                }}
              >
                <h4
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#1a1a1a",
                    marginBottom: "0.75rem",
                  }}
                >
                  Shipping & Returns
                </h4>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    lineHeight: "1.6",
                    margin: "0",
                  }}
                >
                  Free shipping on orders over $100. Returns accepted within 30 days of purchase.
                </p>
              </div>

              <div
                style={{
                  padding: "1.5rem",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h4
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#1a1a1a",
                    marginBottom: "1rem",
                  }}
                >
                  Reviews
                </h4>
                <div
                  style={{
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "1rem",
                  }}
                >
                  <div
                    style={{
                      marginBottom: "1rem",
                      paddingBottom: "1rem",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#1a1a1a",
                        }}
                      >
                        John D.
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#6b7280",
                        }}
                      >
                        ⭐⭐⭐⭐⭐
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        lineHeight: "1.6",
                        margin: "0",
                      }}
                    >
                      Great product! Very satisfied with the quality and delivery.
                    </p>
                  </div>
                  <div
                    style={{
                      marginBottom: "1rem",
                      paddingBottom: "1rem",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#1a1a1a",
                        }}
                      >
                        Sarah M.
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#6b7280",
                        }}
                      >
                        ⭐⭐⭐⭐
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        lineHeight: "1.6",
                        margin: "0",
                      }}
                    >
                      Good value for money. Would recommend to others.
                    </p>
                  </div>
                  <div
                    style={{
                      paddingTop: "1rem",
                      borderTop: "1px solid #e5e7eb",
                    }}
                  >
                    <textarea
                      placeholder="Write your review..."
                      style={{
                        width: "100%",
                        minHeight: "100px",
                        padding: "0.75rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0",
                        fontSize: "0.875rem",
                        fontFamily: "inherit",
                        resize: "vertical",
                        marginBottom: "0.75rem",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1.25rem",
                            padding: "0",
                          }}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                    <Button
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        backgroundColor: "#1a1a1a",
                        color: "#ffffff",
                        border: "none",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#000000";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#1a1a1a";
                      }}
                      onClick={() => {
                        alertify.success("Review submitted!");
                      }}
                    >
                      Submit Review
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    products: state.productListReducer,
    favorites: state.favoriteReducer || [],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      getProducts: bindActionCreators(productActions.getProducts, dispatch),
      addToCart: bindActionCreators(cartActions.addToCart, dispatch),
      addToFavorites: bindActionCreators(
        favoriteActions.addToFavorites,
        dispatch
      ),
      removeFromFavorites: bindActionCreators(
        favoriteActions.removeFromFavorites,
        dispatch
      ),
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductDetailWrapper);
