import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Button } from "reactstrap";
import { bindActionCreators } from "redux";
import * as productActions from "../../redux/actions/productActions.jsx";
import * as cartActions from "../../redux/actions/cartActions.jsx";
import alertify from "alertifyjs";

class FeaturedProducts extends Component {
  componentDidMount() {
    if (!this.props.products || this.props.products.length === 0) {
      this.props.actions.getProducts();
    }
  }

  addToCart = (product) => {
    this.props.actions.addToCart({ quantity: 1, product });
    alertify.success(product.productName + " added to cart.");
  };

  getFeaturedProducts = () => {
    const productsData =
      this.props.products?.data || this.props.products || [];
    const products = Array.isArray(productsData) ? productsData : [];
    const favorites = this.props.favorites || [];

    const productsWithFavoriteCount = products.map((product) => {
      const isFavorite = favorites.some((fav) => fav.id === product.id);
      return {
        ...product,
        favoriteCount: isFavorite ? 1 : 0,
      };
    });

    const sortedByFavorites = [...productsWithFavoriteCount].sort(
      (a, b) => b.favoriteCount - a.favoriteCount
    );

    const topProducts = sortedByFavorites.slice(0, 8);

    if (topProducts.length < 8) {
      const remaining = products
        .filter(
          (p) => !topProducts.some((tp) => tp.id === p.id)
        )
        .slice(0, 8 - topProducts.length);
      return [...topProducts, ...remaining].slice(0, 8);
    }

    return topProducts;
  };

  render() {
    const featuredProducts = this.getFeaturedProducts();
    const isLoading = this.props.products?.loading || false;

    if (isLoading) {
      return (
        <div className="text-center py-5">
          <div className="modern-spinner mx-auto"></div>
        </div>
      );
    }

    if (!featuredProducts || featuredProducts.length === 0) {
      return null;
    }

    return (
      <div style={{ marginBottom: "4rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "300",
                letterSpacing: "2px",
                color: "#1a1a1a",
                marginBottom: "0.5rem",
              }}
            >
              Featured Products
            </h2>
            <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
              Our most loved pieces
            </p>
          </div>
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              const event = new CustomEvent("showAllProducts");
              window.dispatchEvent(event);
            }}
            style={{
              color: "#1a1a1a",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: "500",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderBottom: "1px solid #1a1a1a",
              paddingBottom: "0.25rem",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.6")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            View All
          </Link>
        </div>

        <Row className="g-4">
          {featuredProducts.map((product) => (
            <Col key={product.id} md="3" sm="6" xs="12" style={{ display: "flex" }}>
              <div className="product-card" style={{ width: "100%" }}>
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
                          const placeholder = e.target.parentElement.querySelector(
                            ".image-placeholder"
                          );
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
                    <h3 className="product-card-title" style={{ minHeight: "3rem", marginBottom: "0.75rem" }}>
                      {product.productName}
                    </h3>
                    <div className="product-card-price" style={{ marginBottom: "1rem" }}>
                      ${parseFloat(product.unitPrice || 0).toFixed(2)}
                    </div>
                  </div>
                </Link>
                {!this.props.auth?.isAuthenticated || this.props.auth?.user?.role !== "admin" ? (
                  <div style={{ padding: "0 1.5rem 1.5rem 1.5rem", marginTop: "auto" }}>
                    <Button
                      className="btn-modern w-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.addToCart(product);
                      }}
                      disabled={product.unitsInStock === 0}
                      style={{ width: "100%" }}
                    >
                      {product.unitsInStock > 0 ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                ) : null}
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    products: state.productListReducer,
    favorites: state.favoriteReducer || [],
    auth: state.authReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      getProducts: bindActionCreators(productActions.getProducts, dispatch),
      addToCart: bindActionCreators(cartActions.addToCart, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeaturedProducts);

