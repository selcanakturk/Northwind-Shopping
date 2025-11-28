import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Button } from "reactstrap";
import { bindActionCreators } from "redux";
import * as favoriteActions from "../../redux/actions/favoriteActions.jsx";
import alertify from "alertifyjs";

class Favorites extends Component {
  removeFromFavorites = (product) => {
    this.props.actions.removeFromFavorites(product.id);
    alertify.error(product.productName + " removed from favorites.");
  };

  render() {
    const { favorites } = this.props;

    if (!favorites || favorites.length === 0) {
      return (
        <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❤️</div>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "300",
              marginBottom: "1rem",
              color: "#1a1a1a",
            }}
          >
            No Favorites Yet
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
            Start adding products to your favorites
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
            Browse Products
          </Link>
        </div>
      );
    }

    return (
      <div style={{ padding: "2rem 0" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "300",
              letterSpacing: "2px",
              color: "#1a1a1a",
              marginBottom: "0.5rem",
            }}
          >
            My Favorites
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            {favorites.length} {favorites.length === 1 ? "item" : "items"} in your favorites
          </p>
        </div>

        <Row className="g-4">
          {favorites.map((product) => (
            <Col key={product.id} md="4" sm="6" xs="12">
              <div className="product-card" style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    zIndex: 10,
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      this.removeFromFavorites(product);
                    }}
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      padding: "0",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#ffffff";
                      e.target.style.borderColor = "#ef4444";
                      e.target.style.transform = "scale(1.1)";
                      const svg = e.target.querySelector("svg");
                      if (svg) {
                        svg.style.stroke = "#ef4444";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(255, 255, 255, 0.9)";
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.transform = "scale(1)";
                      const svg = e.target.querySelector("svg");
                      if (svg) {
                        svg.style.stroke = "#6b7280";
                      }
                    }}
                    title="Remove from favorites"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transition: "stroke 0.2s ease",
                      }}
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
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
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#9ca3af",
                          fontSize: "0.875rem",
                          backgroundColor: "#f0f0f0",
                        }}
                      >
                        Product Image
                      </div>
                    )}
                  </div>
                  <div className="product-card-body">
                    <h3 className="product-card-title">{product.productName}</h3>
                    <div className="product-card-price">
                      ${parseFloat(product.unitPrice || 0).toFixed(2)}
                    </div>
                  </div>
                </Link>
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
    favorites: state.favoriteReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      removeFromFavorites: bindActionCreators(
        favoriteActions.removeFromFavorites,
        dispatch
      ),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);

