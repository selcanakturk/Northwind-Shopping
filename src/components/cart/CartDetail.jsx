import React, { Component } from "react";
import { bindActionCreators } from "redux";
import * as cartActions from "../../redux/actions/cartActions.jsx";
import { connect } from "react-redux";
import { Button, Input } from "reactstrap";
import { Link } from "react-router-dom";
import alertify from "alertifyjs";

class CartDetail extends Component {
  removeFromCart = (product) => {
    this.props.actions.removeFromCart(product);
    alertify.error(product.productName + " sepetten çıkarıldı.");
  };

  updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      const product = this.props.cart.find(
        (item) => item.product.id === productId
      )?.product;
      if (product) {
        this.removeFromCart(product);
      }
    } else {
      this.props.actions.updateCartQuantity(productId, newQuantity);
    }
  };

  render() {
    const total = this.props.cart
      ? this.props.cart.reduce(
        (total, item) => total + item.product.unitPrice * item.quantity,
        0
      )
      : 0;

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
            Shopping Cart
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            {this.props.cart && this.props.cart.length > 0
              ? `${this.props.cart.reduce((total, item) => total + item.quantity, 0)} items in your cart`
              : "Your cart is empty"}
          </p>
        </div>

        {this.props.cart && this.props.cart.length > 0 ? (
          <div>
            <div
              style={{
                border: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
                marginBottom: "2rem",
              }}
            >
              {this.props.cart.map((cartItem) => (
                <div
                  key={cartItem.product.id}
                  style={{
                    padding: "1.5rem",
                    borderBottom: "1px solid #e5e7eb",
                    display: "flex",
                    gap: "1.5rem",
                  }}
                >
                  {cartItem.product.imageUrl && (
                    <div
                      style={{
                        width: "120px",
                        height: "120px",
                        flexShrink: 0,
                        backgroundColor: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={cartItem.product.imageUrl}
                        alt={cartItem.product.productName}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: "1rem",
                        fontWeight: "500",
                        color: "#1a1a1a",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {cartItem.product.productName}
                    </h3>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        marginBottom: "1rem",
                      }}
                    >
                      ${parseFloat(cartItem.product.unitPrice || 0).toFixed(2)} each
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <Button
                          style={{
                            background: "#ffffff",
                            border: "none",
                            borderRight: "1px solid #e5e7eb",
                            color: "#1a1a1a",
                            padding: "0.5rem 0.75rem",
                            cursor: "pointer",
                            fontSize: "1rem",
                            fontWeight: "400",
                          }}
                          onClick={() =>
                            this.updateQuantity(
                              cartItem.product.id,
                              cartItem.quantity - 1
                            )
                          }
                        >
                          −
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={cartItem.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            this.updateQuantity(cartItem.product.id, value);
                          }}
                          style={{
                            textAlign: "center",
                            border: "none",
                            width: "60px",
                            padding: "0.5rem",
                            fontSize: "0.875rem",
                          }}
                        />
                        <Button
                          style={{
                            background: "#ffffff",
                            border: "none",
                            borderLeft: "1px solid #e5e7eb",
                            color: "#1a1a1a",
                            padding: "0.5rem 0.75rem",
                            cursor: "pointer",
                            fontSize: "1rem",
                            fontWeight: "400",
                          }}
                          onClick={() =>
                            this.updateQuantity(
                              cartItem.product.id,
                              cartItem.quantity + 1
                            )
                          }
                        >
                          +
                        </Button>
                      </div>
                      <div
                        style={{
                          fontSize: "1.125rem",
                          fontWeight: "600",
                          color: "#1a1a1a",
                        }}
                      >
                        ${(cartItem.product.unitPrice * cartItem.quantity).toFixed(2)}
                      </div>
                      <Button
                        onClick={() => this.removeFromCart(cartItem.product)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                          padding: "0.5rem",
                          fontSize: "0.875rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginLeft: "auto",
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                border: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
                padding: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "500",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#1a1a1a",
                  }}
                >
                  Subtotal
                </span>
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "#1a1a1a",
                  }}
                >
                  ${total.toFixed(2)}
                </span>
              </div>
              <Link
                to="/checkout"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "1rem",
                  backgroundColor: "#1a1a1a",
                  color: "#ffffff",
                  textAlign: "center",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#000000")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#1a1a1a")}
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              border: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛒</div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "500",
                color: "#1a1a1a",
                marginBottom: "0.5rem",
              }}
            >
              Your cart is empty
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              Start adding items to your cart
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
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#000000")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#1a1a1a")}
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      removeFromCart: bindActionCreators(cartActions.removeFromCart, dispatch),
      updateCartQuantity: bindActionCreators(
        cartActions.updateCartQuantity,
        dispatch
      ),
    },
  };
}
function mapStateToProps(state) {
  return {
    cart: state.cartReducer,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(CartDetail);
