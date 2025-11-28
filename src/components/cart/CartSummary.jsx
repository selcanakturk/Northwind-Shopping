import React, { Component } from "react";
import { connect } from "react-redux";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavItem,
  NavLink,
  Badge,
} from "reactstrap";
import { bindActionCreators } from "redux";
import * as cartActions from "../../redux/actions/cartActions.jsx";
import { Link } from "react-router-dom";
import alertify from "alertifyjs";

class CartSummary extends Component {
  renderEmpty() {
    return (
      <DropdownItem disabled style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
        <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
          <div style={{ marginBottom: "0.5rem", fontSize: "2rem" }}>🛒</div>
          <div>Your cart is empty</div>
        </div>
      </DropdownItem>
    );
  }

  removeFromCart = (product) => {
    this.props.actions.removeFromCart(product);
    alertify.error(product.productName + " removed from cart.");
  };

  render() {
    return (
      <NavItem>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle
            nav
            style={{
              color: "#1a1a1a",
              fontWeight: "400",
              background: "transparent",
              border: "none",
              padding: "0.5rem",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            <span style={{ fontSize: "0.875rem", fontWeight: "400" }}>Cart</span>
            {this.props.cart && this.props.cart.length > 0 && (
              <Badge
                style={{
                  background: "#1a1a1a",
                  color: "white",
                  borderRadius: "0",
                  minWidth: "24px",
                  height: "24px",
                  fontSize: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 0.5rem",
                  fontWeight: "600",
                }}
              >
                {this.props.cart.reduce(
                  (total, item) => total + item.quantity,
                  0
                )}
              </Badge>
            )}
          </DropdownToggle>
          <DropdownMenu
            end
            style={{
              minWidth: "320px",
              maxWidth: "400px",
              borderRadius: "0",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "0",
            }}
          >
            {this.props.cart && this.props.cart.length > 0 ? (
              <>
                <div
                  style={{
                    padding: "1rem 1.25rem",
                    borderBottom: "1px solid #e5e7eb",
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <h6
                    style={{
                      margin: "0",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      color: "#1a1a1a",
                    }}
                  >
                    Cart ({this.props.cart.reduce((total, item) => total + item.quantity, 0)} items)
                  </h6>
                </div>
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {this.props.cart.map((cartItem) => (
                    <DropdownItem
                      key={cartItem.product.id}
                      style={{
                        padding: "1rem 1.25rem",
                        borderBottom: "1px solid #f3f4f6",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start gap-3">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: "0.875rem",
                              fontWeight: "500",
                              color: "#1a1a1a",
                              marginBottom: "0.25rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {cartItem.product.productName}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#6b7280",
                              marginBottom: "0.5rem",
                            }}
                          >
                            ${parseFloat(cartItem.product.unitPrice || 0).toFixed(2)} × {cartItem.quantity}
                          </div>
                          <div
                            style={{
                              fontSize: "0.875rem",
                              fontWeight: "600",
                              color: "#1a1a1a",
                            }}
                          >
                            ${(cartItem.product.unitPrice * cartItem.quantity).toFixed(2)}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            this.removeFromCart(cartItem.product);
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                            padding: "0.25rem 0.5rem",
                            fontSize: "1.25rem",
                            lineHeight: "1",
                            transition: "opacity 0.2s ease",
                          }}
                          onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
                          onMouseLeave={(e) => (e.target.style.opacity = "1")}
                        >
                          ×
                        </button>
                      </div>
                    </DropdownItem>
                  ))}
                </div>
                <div
                  style={{
                    padding: "1rem 1.25rem",
                    borderTop: "2px solid #e5e7eb",
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ marginBottom: "1rem" }}
                  >
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        color: "#1a1a1a",
                      }}
                    >
                      Total:
                    </span>
                    <span
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "600",
                        color: "#1a1a1a",
                      }}
                    >
                      $
                      {this.props.cart
                        .reduce(
                          (total, item) =>
                            total + item.product.unitPrice * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <Link
                    to="/cart"
                    className="text-decoration-none"
                    style={{ display: "block" }}
                  >
                    <div
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        backgroundColor: "#1a1a1a",
                        color: "#ffffff",
                        textAlign: "center",
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
                      View Cart
                    </div>
                  </Link>
                </div>
              </>
            ) : (
              this.renderEmpty()
            )}
          </DropdownMenu>
        </UncontrolledDropdown>
      </NavItem>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    actions: {
      removeFromCart: bindActionCreators(cartActions.removeFromCart, dispatch),
    },
  };
}
function mapStateToProps(state) {
  return {
    cart: state.cartReducer,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(CartSummary);
