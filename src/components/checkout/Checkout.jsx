import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Input, Button, InputGroup, InputGroupText } from "reactstrap";
import alertify from "alertifyjs";
import * as couponActions from "../../redux/actions/couponActions.jsx";
import * as orderActions from "../../redux/actions/orderActions.jsx";
import * as cartActions from "../../redux/actions/cartActions.jsx";

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
        country: "",
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
      },
      errors: {},
      couponCode: "",
    };
  }

  componentDidMount() {
    this.props.actions.getCoupons();
  }

  handleCouponChange = (e) => {
    this.setState({ couponCode: e.target.value.toUpperCase() });
  };

  handleApplyCoupon = () => {
    const { couponCode } = this.state;
    const { cart } = this.props;
    const subtotal = cart.reduce(
      (total, item) => total + item.product.unitPrice * item.quantity,
      0
    );
    this.props.actions.applyCoupon(couponCode, subtotal);
  };

  handleRemoveCoupon = () => {
    this.props.actions.removeCoupon();
    this.setState({ couponCode: "" });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: value,
      },
      errors: {
        ...prevState.errors,
        [name]: "",
      },
    }));
  };

  validate = () => {
    const { formData } = this.state;
    const errors = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.zipCode.trim()) errors.zipCode = "Zip code is required";
    if (!formData.country.trim()) errors.country = "Country is required";
    if (!formData.cardNumber.trim()) errors.cardNumber = "Card number is required";
    if (!formData.cardName.trim()) errors.cardName = "Card name is required";
    if (!formData.expiryDate.trim()) errors.expiryDate = "Expiry date is required";
    if (!formData.cvv.trim()) errors.cvv = "CVV is required";

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.validate()) {
      const { cart, coupon, auth } = this.props;
      const { formData } = this.state;

      if (!auth.isAuthenticated) {
        alertify.error("Please login to place an order.");
        return;
      }

      const subtotal = cart.reduce(
        (total, item) => total + item.product.unitPrice * item.quantity,
        0
      );
      const shipping = subtotal > 100 ? 0 : 15;
      const tax = (subtotal - (coupon?.discountAmount || 0)) * 0.1;
      const discount = coupon?.discountAmount || 0;
      const total = subtotal - discount + shipping + tax;

      const orderData = {
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.productName,
          quantity: item.quantity,
          unitPrice: item.product.unitPrice,
          totalPrice: item.product.unitPrice * item.quantity,
        })),
        shippingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentInfo: {
          cardNumber: formData.cardNumber.slice(-4),
          cardName: formData.cardName,
        },
        pricing: {
          subtotal,
          discount,
          shipping,
          tax,
          total,
        },
        couponCode: coupon?.appliedCoupon?.code || null,
      };

      const order = this.props.actions.createOrder(orderData);

      if (order) {
        cart.forEach((item) => {
          this.props.actions.removeFromCart(item.product);
        });

        this.props.actions.removeCoupon();

        alertify.success(`Order #${order.orderNumber} placed successfully!`);
        setTimeout(() => {
          this.props.navigate("/");
        }, 2000);
      }
    }
  };

  render() {
    const { cart, coupon } = this.props;
    const { formData, errors, couponCode } = this.state;

    if (!cart || cart.length === 0) {
      return (
        <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "300", marginBottom: "1rem" }}>
            Your cart is empty
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
            Add items to your cart before checkout
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
            Continue Shopping
          </Link>
        </div>
      );
    }

    const subtotal = cart.reduce(
      (total, item) => total + item.product.unitPrice * item.quantity,
      0
    );
    const shipping = subtotal > 100 ? 0 : 15;
    const tax = (subtotal - (coupon?.discountAmount || 0)) * 0.1;
    const discount = coupon?.discountAmount || 0;
    const total = subtotal - discount + shipping + tax;

    return (
      <div style={{ padding: "3rem 0" }}>
        <div style={{ marginBottom: "2rem" }}>
          <Link
            to="/cart"
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
            ← Back to Cart
          </Link>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "300",
              letterSpacing: "2px",
              color: "#1a1a1a",
              marginTop: "1rem",
            }}
          >
            Checkout
          </h1>
        </div>

        <Row>
          <Col md="8">
            <form onSubmit={this.handleSubmit}>
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
                <Row>
                  <Col md="6">
                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#1a1a1a",
                          marginBottom: "0.5rem",
                        }}
                      >
                        First Name *
                      </label>
                      <Input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={this.handleChange}
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: "0",
                          padding: "0.75rem",
                        }}
                      />
                      {errors.firstName && (
                        <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                          {errors.firstName}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col md="6">
                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#1a1a1a",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Last Name *
                      </label>
                      <Input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={this.handleChange}
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: "0",
                          padding: "0.75rem",
                        }}
                      />
                      {errors.lastName && (
                        <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                          {errors.lastName}
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#1a1a1a",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Email *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={this.handleChange}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "0",
                      padding: "0.75rem",
                    }}
                  />
                  {errors.email && (
                    <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                      {errors.email}
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#1a1a1a",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Phone *
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={this.handleChange}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "0",
                      padding: "0.75rem",
                    }}
                  />
                  {errors.phone && (
                    <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                      {errors.phone}
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#1a1a1a",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Address *
                  </label>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={this.handleChange}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "0",
                      padding: "0.75rem",
                    }}
                  />
                  {errors.address && (
                    <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                      {errors.address}
                    </div>
                  )}
                </div>
                <Row>
                  <Col md="6">
                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#1a1a1a",
                          marginBottom: "0.5rem",
                        }}
                      >
                        City *
                      </label>
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={this.handleChange}
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: "0",
                          padding: "0.75rem",
                        }}
                      />
                      {errors.city && (
                        <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                          {errors.city}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col md="3">
                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#1a1a1a",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Zip Code *
                      </label>
                      <Input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={this.handleChange}
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: "0",
                          padding: "0.75rem",
                        }}
                      />
                      {errors.zipCode && (
                        <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                          {errors.zipCode}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col md="3">
                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#1a1a1a",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Country *
                      </label>
                      <Input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={this.handleChange}
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: "0",
                          padding: "0.75rem",
                        }}
                      />
                      {errors.country && (
                        <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                          {errors.country}
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
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
                  Payment Information
                </h3>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#1a1a1a",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Card Number *
                  </label>
                  <Input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={this.handleChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "0",
                      padding: "0.75rem",
                    }}
                  />
                  {errors.cardNumber && (
                    <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                      {errors.cardNumber}
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#1a1a1a",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Cardholder Name *
                  </label>
                  <Input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={this.handleChange}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "0",
                      padding: "0.75rem",
                    }}
                  />
                  {errors.cardName && (
                    <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                      {errors.cardName}
                    </div>
                  )}
                </div>
                <Row>
                  <Col md="6">
                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#1a1a1a",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Expiry Date *
                      </label>
                      <Input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={this.handleChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: "0",
                          padding: "0.75rem",
                        }}
                      />
                      {errors.expiryDate && (
                        <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                          {errors.expiryDate}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col md="6">
                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#1a1a1a",
                          marginBottom: "0.5rem",
                        }}
                      >
                        CVV *
                      </label>
                      <Input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={this.handleChange}
                        placeholder="123"
                        maxLength="3"
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: "0",
                          padding: "0.75rem",
                        }}
                      />
                      {errors.cvv && (
                        <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                          {errors.cvv}
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
            </form>
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

              <div style={{ marginBottom: "1.5rem" }}>
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                      paddingBottom: "1rem",
                      borderBottom: "1px solid #f3f4f6",
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
                        {item.product.productName}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#6b7280",
                        }}
                      >
                        Qty: {item.quantity}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#1a1a1a",
                      }}
                    >
                      ${(item.product.unitPrice * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

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
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                {coupon?.appliedCoupon && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.75rem",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                        Discount ({coupon.appliedCoupon.code})
                      </span>
                      <button
                        onClick={this.handleRemoveCoupon}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ef4444",
                          fontSize: "0.75rem",
                          marginLeft: "0.5rem",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    <span style={{ fontSize: "0.875rem", color: "#10b981", fontWeight: "600" }}>
                      -${discount.toFixed(2)}
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
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
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
                    ${tax.toFixed(2)}
                  </span>
                </div>
              </div>

              {!coupon?.appliedCoupon && (
                <div
                  style={{
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#1a1a1a",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Coupon Code
                  </label>
                  <InputGroup>
                    <Input
                      type="text"
                      value={couponCode}
                      onChange={this.handleCouponChange}
                      placeholder="Enter coupon code"
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "0",
                        padding: "0.75rem",
                        fontSize: "0.875rem",
                        textTransform: "uppercase",
                      }}
                    />
                    <InputGroupText
                      style={{
                        background: "#1a1a1a",
                        color: "#ffffff",
                        border: "none",
                        cursor: "pointer",
                        padding: "0.75rem 1rem",
                      }}
                      onClick={this.handleApplyCoupon}
                    >
                      Apply
                    </InputGroupText>
                  </InputGroup>
                </div>
              )}

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
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                onClick={this.handleSubmit}
                style={{
                  width: "100%",
                  padding: "1rem 2rem",
                  backgroundColor: "#1a1a1a",
                  color: "#ffffff",
                  border: "none",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
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
                Place Order
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

function CheckoutWrapper(props) {
  const navigate = useNavigate();
  return <Checkout {...props} navigate={navigate} />;
}

function mapStateToProps(state) {
  return {
    cart: state.cartReducer,
    coupon: state.couponReducer,
    auth: state.authReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      getCoupons: bindActionCreators(couponActions.getCoupons, dispatch),
      applyCoupon: bindActionCreators(couponActions.applyCoupon, dispatch),
      removeCoupon: bindActionCreators(couponActions.removeCoupon, dispatch),
      createOrder: bindActionCreators(orderActions.createOrder, dispatch),
      removeFromCart: bindActionCreators(cartActions.removeFromCart, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutWrapper);

