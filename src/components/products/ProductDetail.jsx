import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button, Row, Col, Input } from "reactstrap";
import * as productActions from "../../redux/actions/productActions.jsx";
import * as cartActions from "../../redux/actions/cartActions.jsx";
import * as favoriteActions from "../../redux/actions/favoriteActions.jsx";
import * as reviewActions from "../../redux/actions/reviewActions.jsx";
import alertify from "alertifyjs";

function ProductDetailWrapper(props) {
  const { productId } = useParams();
  const navigate = useNavigate();
  return <ProductDetail {...props} productId={productId} navigate={navigate} />;
}

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewText: "",
      reviewRating: 0,
      hoveredRating: 0,
    };
  }

  componentDidMount() {
    this.props.actions.getProducts();
    const productId = parseInt(this.props.productId, 10);
    if (productId) {
      this.props.actions.getReviews(productId);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.productId !== this.props.productId) {
      const productId = parseInt(this.props.productId, 10);
      if (productId) {
        this.props.actions.getReviews(productId);
      }
    }
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

  getReviews = () => {
    const productId = parseInt(this.props.productId, 10);
    return this.props.reviews[productId] || [];
  };

  handleReviewChange = (e) => {
    this.setState({ reviewText: e.target.value });
  };

  handleRatingClick = (rating) => {
    this.setState({ reviewRating: rating });
  };

  handleRatingHover = (rating) => {
    this.setState({ hoveredRating: rating });
  };

  handleRatingLeave = () => {
    this.setState({ hoveredRating: 0 });
  };

  submitReview = () => {
    const { reviewText, reviewRating } = this.state;
    const product = this.getProductById();
    const productId = parseInt(this.props.productId, 10);

    if (!product) {
      alertify.error("Product not found.");
      return;
    }

    if (!reviewText.trim()) {
      alertify.error("Please enter a review text.");
      return;
    }

    if (reviewRating === 0) {
      alertify.error("Please select a rating.");
      return;
    }

    this.props.actions.addReview({
      productId,
      rating: reviewRating,
      comment: reviewText.trim(),
    });

    this.setState({ reviewText: "", reviewRating: 0, hoveredRating: 0 });
  };

  deleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      this.props.actions.deleteReview(reviewId);
    }
  };

  formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  renderStars = (rating, size = "1rem") => {
    return (
      <div style={{ display: "flex", gap: "0.25rem" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              fontSize: size,
              color: star <= rating ? "#f59e0b" : "#d1d5db",
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  getAverageRating = () => {
    const reviews = this.getReviews();
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  getSimilarProducts = () => {
    const product = this.getProductById();
    if (!product || !product.categoryId) return [];

    const productsData = this.props.products?.data || this.props.products || [];
    const products = Array.isArray(productsData) ? productsData : [];
    const productId = parseInt(this.props.productId, 10);

    const similarProducts = products.filter(
      (p) => p.categoryId === product.categoryId && p.id !== productId
    );

    return similarProducts.slice(0, 4);
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
                {!this.props.auth?.isAuthenticated || this.props.auth?.user?.role !== "admin" ? (
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
                ) : null}
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

              {!this.props.auth?.isAuthenticated || this.props.auth?.user?.role !== "admin" ? (
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
              ) : null}

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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      color: "#1a1a1a",
                      margin: 0,
                    }}
                  >
                    Reviews
                  </h4>
                  {this.getReviews().length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                        Average Rating:
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {this.renderStars(Math.round(this.getAverageRating()))}
                        <span
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: "#1a1a1a",
                          }}
                        >
                          {this.getAverageRating()}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                          ({this.getReviews().length} {this.getReviews().length === 1 ? "review" : "reviews"})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "1rem",
                  }}
                >
                  {this.getReviews().length > 0 ? (
                    <div style={{ marginBottom: "1.5rem" }}>
                      {this.getReviews().map((review) => (
                        <div
                          key={review.id}
                          style={{
                            marginBottom: "1rem",
                            paddingBottom: "1rem",
                            borderBottom: "1px solid #f3f4f6",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.75rem",
                                  marginBottom: "0.25rem",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "0.875rem",
                                    fontWeight: "500",
                                    color: "#1a1a1a",
                                  }}
                                >
                                  {review.username}
                                </span>
                                {this.renderStars(review.rating, "0.875rem")}
                              </div>
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#6b7280",
                                }}
                              >
                                {this.formatDate(review.date)}
                              </span>
                            </div>
                            {(this.props.auth.user?.role === "admin" ||
                              this.props.auth.user?.id === review.userId) && (
                                <button
                                  onClick={() => this.deleteReview(review.id)}
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "#ef4444",
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                    padding: "0.25rem 0.5rem",
                                    transition: "opacity 0.2s ease",
                                  }}
                                  onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
                                  onMouseLeave={(e) => (e.target.style.opacity = "1")}
                                >
                                  Delete
                                </button>
                              )}
                          </div>
                          <p
                            style={{
                              fontSize: "0.875rem",
                              color: "#6b7280",
                              lineHeight: "1.6",
                              margin: "0",
                            }}
                          >
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        textAlign: "center",
                        padding: "2rem 0",
                        margin: 0,
                      }}
                    >
                      No reviews yet. Be the first to review this product!
                    </p>
                  )}

                  {this.props.auth.isAuthenticated && this.props.auth.user?.role !== "admin" ? (
                    <div
                      style={{
                        paddingTop: "1rem",
                        borderTop: "1px solid #e5e7eb",
                      }}
                    >
                      <h5
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#1a1a1a",
                          marginBottom: "0.75rem",
                        }}
                      >
                        Write a Review
                      </h5>
                      <div style={{ marginBottom: "0.75rem" }}>
                        <label
                          style={{
                            display: "block",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            color: "#1a1a1a",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Rating <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            alignItems: "center",
                          }}
                        >
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => this.handleRatingClick(star)}
                              onMouseEnter={(e) => {
                                this.handleRatingHover(star);
                                e.target.style.transform = "scale(1.2)";
                              }}
                              onMouseLeave={(e) => {
                                this.handleRatingLeave();
                                e.target.style.transform = "scale(1)";
                              }}
                              style={{
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "1.5rem",
                                padding: "0",
                                transition: "transform 0.2s ease",
                              }}
                            >
                              <span
                                style={{
                                  color:
                                    star <= (this.state.hoveredRating || this.state.reviewRating)
                                      ? "#f59e0b"
                                      : "#d1d5db",
                                  transition: "color 0.2s ease",
                                }}
                              >
                                ★
                              </span>
                            </button>
                          ))}
                          {this.state.reviewRating > 0 && (
                            <span
                              style={{
                                fontSize: "0.875rem",
                                color: "#6b7280",
                                marginLeft: "0.5rem",
                              }}
                            >
                              {this.state.reviewRating} {this.state.reviewRating === 1 ? "star" : "stars"}
                            </span>
                          )}
                        </div>
                      </div>
                      <Input
                        type="textarea"
                        placeholder="Share your thoughts on this product..."
                        value={this.state.reviewText}
                        onChange={this.handleReviewChange}
                        rows="4"
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: "0",
                          padding: "0.75rem 1rem",
                          marginBottom: "0.75rem",
                          resize: "vertical",
                          fontSize: "0.875rem",
                        }}
                      />
                      <Button
                        onClick={this.submitReview}
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
                      >
                        Submit Review
                      </Button>
                    </div>
                  ) : this.props.auth.isAuthenticated && this.props.auth.user?.role === "admin" ? null : (
                    <div
                      style={{
                        paddingTop: "1rem",
                        borderTop: "1px solid #e5e7eb",
                        textAlign: "center",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "#6b7280",
                          marginBottom: "1rem",
                        }}
                      >
                        Please{" "}
                        <Link
                          to="/login"
                          style={{
                            color: "#1a1a1a",
                            textDecoration: "underline",
                          }}
                        >
                          login
                        </Link>{" "}
                        to write a review.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {this.getSimilarProducts().length > 0 && (
          <div style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid #e5e7eb" }}>
            <div style={{ marginBottom: "2rem" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "300",
                  letterSpacing: "1px",
                  color: "#1a1a1a",
                  marginBottom: "0.5rem",
                }}
              >
                Similar Products
              </h2>
              <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                You might also like these products from the same category
              </p>
            </div>

            <Row className="g-4">
              {this.getSimilarProducts().map((similarProduct) => (
                <Col key={similarProduct.id} md="3" sm="6" xs="12">
                  <div
                    className="product-card"
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Link
                      to={"/product/" + similarProduct.id}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <div
                        className="product-card-image"
                        style={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "1",
                          backgroundColor: "#f9fafb",
                          border: "1px solid #e5e7eb",
                          overflow: "hidden",
                          marginBottom: "1rem",
                        }}
                      >
                        {similarProduct.imageUrl ? (
                          <img
                            src={similarProduct.imageUrl}
                            alt={similarProduct.productName}
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
                            display: similarProduct.imageUrl ? "none" : "flex",
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
                      <div className="product-card-body" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        <h3
                          className="product-card-title"
                          style={{
                            fontSize: "1rem",
                            fontWeight: "500",
                            color: "#1a1a1a",
                            marginBottom: "0.5rem",
                            lineHeight: "1.4",
                          }}
                        >
                          {similarProduct.productName}
                        </h3>
                        <div
                          className="product-card-price"
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: "600",
                            color: "#1a1a1a",
                            marginTop: "auto",
                          }}
                        >
                          ${parseFloat(similarProduct.unitPrice || 0).toFixed(2)}
                        </div>
                      </div>
                    </Link>
                    {!this.props.auth?.isAuthenticated || this.props.auth?.user?.role !== "admin" ? (
                      <div style={{ padding: "0 1.5rem 1.5rem 1.5rem", marginTop: "1rem" }}>
                        <span
                          className={`product-card-stock ${similarProduct.unitsInStock > 20
                            ? "in-stock"
                            : similarProduct.unitsInStock > 0
                              ? "low-stock"
                              : "out-of-stock"
                            }`}
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            display: "block",
                            marginBottom: "0.75rem",
                          }}
                        >
                          {similarProduct.unitsInStock > 20
                            ? "In Stock"
                            : similarProduct.unitsInStock > 0
                              ? "Low Stock"
                              : "Out of Stock"}
                        </span>
                        <Button
                          className="btn-modern w-100"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.addToCart(similarProduct);
                          }}
                          disabled={similarProduct.unitsInStock === 0}
                          style={{
                            width: "100%",
                            padding: "0.75rem 1rem",
                            backgroundColor:
                              similarProduct.unitsInStock > 0 ? "#1a1a1a" : "#9ca3af",
                            color: "#ffffff",
                            border: "none",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            cursor: similarProduct.unitsInStock > 0 ? "pointer" : "not-allowed",
                            transition: "background-color 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            if (similarProduct.unitsInStock > 0) {
                              e.target.style.backgroundColor = "#000000";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (similarProduct.unitsInStock > 0) {
                              e.target.style.backgroundColor = "#1a1a1a";
                            }
                          }}
                        >
                          {similarProduct.unitsInStock > 0 ? "Add to Cart" : "Out of Stock"}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    products: state.productListReducer,
    favorites: state.favoriteReducer || [],
    reviews: state.reviewReducer || {},
    auth: state.authReducer,
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
      getReviews: bindActionCreators(reviewActions.getReviews, dispatch),
      addReview: bindActionCreators(reviewActions.addReview, dispatch),
      deleteReview: bindActionCreators(reviewActions.deleteReview, dispatch),
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductDetailWrapper);
