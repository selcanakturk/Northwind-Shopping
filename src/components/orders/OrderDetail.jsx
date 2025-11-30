import React, { Component } from "react";
import { connect } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { Row, Col } from "reactstrap";
import * as orderActions from "../../redux/actions/orderActions.jsx";

function OrderDetailWrapper(props) {
  const { orderId } = useParams();
  const navigate = useNavigate();
  return <OrderDetail {...props} orderId={orderId} navigate={navigate} />;
}

class OrderDetail extends Component {
  componentDidMount() {
    if (!this.props.auth || !this.props.auth.isAuthenticated) {
      this.props.navigate("/login");
      return;
    }
    // Admin ise tüm siparişleri getir, değilse sadece kendi siparişlerini
    if (this.props.auth.user && this.props.auth.user.role === "admin") {
      this.props.actions.getOrders();
    } else {
      this.props.actions.getOrders(this.props.auth.user.id);
    }
  }

  getOrderById = () => {
    const { orders } = this.props;
    if (!orders || !orders.orders || !Array.isArray(orders.orders)) return null;
    
    const orderIdParam = this.props.orderId;
    if (!orderIdParam) return null;
    
    // Order ID'yi hem string hem number olarak kontrol et
    const foundOrder = orders.orders.find(
      (order) => {
        if (!order || !order.id) return false;
        // Exact match
        if (order.id === orderIdParam) return true;
        // Number comparison
        const orderIdNum = Number(order.id);
        const paramIdNum = Number(orderIdParam);
        if (!isNaN(orderIdNum) && !isNaN(paramIdNum) && orderIdNum === paramIdNum) return true;
        // String comparison
        if (String(order.id) === String(orderIdParam)) return true;
        return false;
      }
    );
    
    return foundOrder || null;
  };

  formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return { bg: "#fef3c7", text: "#92400e" };
      case "shipped":
        return { bg: "#dbeafe", text: "#1e40af" };
      case "delivered":
        return { bg: "#d1fae5", text: "#065f46" };
      default:
        return { bg: "#f3f4f6", text: "#6b7280" };
    }
  };

  render() {
    const { auth } = this.props;
    const order = this.getOrderById();

    if (!auth.isAuthenticated) {
      return null;
    }

    if (!order) {
      return (
        <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "300", marginBottom: "1rem" }}>
            Order Not Found
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
            The order you're looking for doesn't exist.
          </p>
          <Link
            to="/account"
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
            Back to Account
          </Link>
        </div>
      );
    }

    if (auth.user && order.userId !== auth.user.id && auth.user.role !== "admin") {
      return (
        <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "300", marginBottom: "1rem" }}>
            Access Denied
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
            You don't have permission to view this order.
          </p>
          <Link
            to="/account"
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
            Back to Account
          </Link>
        </div>
      );
    }

    const statusColor = this.getStatusColor(order.status);

    return (
      <div style={{ padding: "3rem 0" }}>
        <div style={{ marginBottom: "2rem" }}>
          <Link
            to="/account"
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
            ← Back to Account
          </Link>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "1rem",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "300",
                  letterSpacing: "2px",
                  color: "#1a1a1a",
                  marginBottom: "0.5rem",
                }}
              >
                Order #{order.orderNumber || order.id}
              </h1>
              <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                Placed on {this.formatDate(order.orderDate)}
              </p>
            </div>
            <span
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                backgroundColor: statusColor.bg,
                color: statusColor.text,
                fontSize: "0.875rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {order.status}
            </span>
          </div>
        </div>

        <Row>
          <Col md="8">
            <div
              style={{
                border: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
                padding: "2rem",
                marginBottom: "2rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#1a1a1a",
                  marginBottom: "1.5rem",
                }}
              >
                Order Items
              </h3>
              <div>
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "1rem 0",
                      borderBottom:
                        index < order.items.length - 1 ? "1px solid #f3f4f6" : "none",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#1a1a1a",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {item.productName}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#6b7280",
                        }}
                      >
                        Quantity: {item.quantity} × ${item.unitPrice.toFixed(2)}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#1a1a1a",
                      }}
                    >
                      ${(item.totalPrice || (item.unitPrice * item.quantity)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                border: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
                padding: "2rem",
                marginBottom: "2rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#1a1a1a",
                  marginBottom: "1.5rem",
                }}
              >
                Shipping Information
              </h3>
              <div
                style={{
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: "1rem",
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
                  <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>Name:</span>
                  <span
                    style={{
                      color: "#1a1a1a",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    }}
                  >
                    {order.shippingInfo?.firstName || order.shippingAddress?.firstName || ""} {order.shippingInfo?.lastName || order.shippingAddress?.lastName || ""}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.75rem 0",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>Email:</span>
                  <span
                    style={{
                      color: "#1a1a1a",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    }}
                  >
                    {order.shippingInfo?.email || order.shippingAddress?.email || ""}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.75rem 0",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>Phone:</span>
                  <span
                    style={{
                      color: "#1a1a1a",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    }}
                  >
                    {order.shippingInfo?.phone || order.shippingAddress?.phone || ""}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.75rem 0",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>Address:</span>
                  <span
                    style={{
                      color: "#1a1a1a",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      textAlign: "right",
                    }}
                  >
                    {order.shippingInfo?.address || order.shippingAddress?.address || ""}
                    <br />
                    {order.shippingInfo?.city || order.shippingAddress?.city || ""}, {order.shippingInfo?.zipCode || order.shippingAddress?.zipCode || ""}
                    <br />
                    {order.shippingInfo?.country || order.shippingAddress?.country || ""}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                border: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
                padding: "2rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#1a1a1a",
                  marginBottom: "1.5rem",
                }}
              >
                Payment Information
              </h3>
              <div
                style={{
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: "1rem",
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
                  <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>Cardholder:</span>
                  <span
                    style={{
                      color: "#1a1a1a",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    }}
                  >
                    {order.paymentInfo?.cardName || order.paymentInfo?.cardholderName || ""}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.75rem 0",
                  }}
                >
                  <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>Card Number:</span>
                  <span
                    style={{
                      color: "#1a1a1a",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    }}
                  >
                    {order.paymentInfo?.cardType ? `${order.paymentInfo.cardType} **** ${order.paymentInfo.last4}` : `**** **** **** ${order.paymentInfo?.cardNumber || ""}`}
                  </span>
                </div>
              </div>
            </div>
          </Col>

          <Col md="4">
            <div
              style={{
                border: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
                padding: "2rem",
                position: "sticky",
                top: "2rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#1a1a1a",
                  marginBottom: "1.5rem",
                }}
              >
                Order Summary
              </h3>

              <div
                style={{
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Subtotal</span>
                  <span style={{ fontSize: "0.875rem", color: "#1a1a1a" }}>
                    ${order.pricing.subtotal.toFixed(2)}
                  </span>
                </div>
                {order.pricing.discount > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      Discount {order.couponCode && `(${order.couponCode})`}
                    </span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "#10b981",
                        fontWeight: "600",
                      }}
                    >
                      -${order.pricing.discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Shipping</span>
                  <span style={{ fontSize: "0.875rem", color: "#1a1a1a" }}>
                    {order.pricing.shipping === 0 ? "Free" : `$${order.pricing.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Tax</span>
                  <span style={{ fontSize: "0.875rem", color: "#1a1a1a" }}>
                    ${order.pricing.tax.toFixed(2)}
                  </span>
                </div>
              </div>

              <div
                style={{
                  borderTop: "2px solid #e5e7eb",
                  paddingTop: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      color: "#1a1a1a",
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "600",
                      color: "#1a1a1a",
                    }}
                  >
                    ${order.pricing.total.toFixed(2)}
                  </span>
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
    orders: state.orderReducer,
    auth: state.authReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      getOrders: bindActionCreators(orderActions.getOrders, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailWrapper);

