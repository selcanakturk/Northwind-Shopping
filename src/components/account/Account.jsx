import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import { Row, Col, Button, Input, Form, FormGroup, Label } from "reactstrap";
import * as authActions from "../../redux/actions/authActions.jsx";
import * as orderActions from "../../redux/actions/orderActions.jsx";
import * as productActions from "../../redux/actions/productActions.jsx";
import alertify from "alertifyjs";

function AccountWrapper(props) {
  const navigate = useNavigate();
  return <Account {...props} navigate={navigate} />;
}

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: this.props.auth?.user?.role === "admin" ? "dashboard" : "profile",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "",
      zipCode: "",
      country: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      passwordErrors: {},
    };
  }

  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.navigate("/login");
    } else {
      this.loadUserProfile();
      // Only load orders for non-admin users
      if (this.props.auth.user && this.props.auth.user.role !== "admin") {
        this.props.actions.getOrders(this.props.auth.user.id);
      } else if (this.props.auth.user && this.props.auth.user.role === "admin") {
        // Load all orders and products for admin statistics
        this.props.actions.getOrders();
        this.props.actions.getProducts();
      }
    }
  }

  loadUserProfile = () => {
    const user = this.props.auth.user;
    if (user) {
      const profile = this.getUserProfile(user.id);
      this.setState({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        zipCode: profile.zipCode || "",
        country: profile.country || "",
      });
    }
  };

  getUserProfile = (userId) => {
    try {
      const profiles = JSON.parse(localStorage.getItem("userProfiles") || "{}");
      return profiles[userId] || {};
    } catch (err) {
      return {};
    }
  };

  saveUserProfile = (profile) => {
    try {
      const userId = this.props.auth.user.id;
      const profiles = JSON.parse(localStorage.getItem("userProfiles") || "{}");
      profiles[userId] = { ...profiles[userId], ...profile };
      localStorage.setItem("userProfiles", JSON.stringify(profiles));
    } catch (err) {
      console.error("Profile kaydedilirken hata:", err);
    }
  };

  handleProfileChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleProfileSave = (e) => {
    e.preventDefault();
    const profile = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phone: this.state.phone,
      address: this.state.address,
      city: this.state.city,
      zipCode: this.state.zipCode,
      country: this.state.country,
    };
    this.saveUserProfile(profile);
    alertify.success("Profile updated successfully!");
  };

  handlePasswordChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
      passwordErrors: {
        ...this.state.passwordErrors,
        [name]: "",
      },
    });
  };

  validatePassword = () => {
    const errors = {};

    if (!this.state.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!this.state.newPassword) {
      errors.newPassword = "New password is required";
    } else if (this.state.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    if (!this.state.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (this.state.newPassword !== this.state.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    this.setState({ passwordErrors: errors });
    return Object.keys(errors).length === 0;
  };

  handlePasswordSave = (e) => {
    e.preventDefault();

    if (!this.validatePassword()) {
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const currentUser = users.find((u) => u.id === this.props.auth.user.id);

    if (currentUser && currentUser.password !== this.state.currentPassword) {
      alertify.error("Current password is incorrect");
      return;
    }

    const updatedUsers = users.map((u) =>
      u.id === this.props.auth.user.id
        ? { ...u, password: this.state.newPassword }
        : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    this.setState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      passwordErrors: {},
    });

    alertify.success("Password changed successfully!");
  };

  getInitials = () => {
    const { firstName, lastName } = this.state;
    if (firstName && lastName) {
      return (firstName[0] + lastName[0]).toUpperCase();
    }
    const username = this.props.auth.user?.username || "";
    return username.substring(0, 2).toUpperCase();
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

  getUserOrders = () => {
    const { orders } = this.props;
    const { user } = this.props.auth;
    if (!user || !orders.orders) return [];
    return orders.orders.filter((order) => order.userId === user.id);
  };

  getAdminStatistics = () => {
    const { orders, products } = this.props;

    const allOrders = orders?.orders || [];
    const allProducts = products?.data || products || [];

    let allUsers = [];
    try {
      allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    } catch (err) {
      console.error("Users yüklenirken hata:", err);
    }

    const totalRevenue = allOrders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
    const pendingOrders = allOrders.filter(o => o.status === "pending").length;
    const lowStockProducts = allProducts.filter(p => p.unitsInStock > 0 && p.unitsInStock <= 10).length;

    return {
      totalOrders: allOrders.length,
      totalRevenue,
      pendingOrders,
      totalProducts: allProducts.length,
      totalUsers: allUsers.length,
      lowStockProducts,
    };
  };

  render() {
    const { auth } = this.props;
    const { activeTab } = this.state;

    if (!auth.isAuthenticated) {
      return null;
    }

    const { user } = auth;

    return (
      <div style={{ padding: "3rem 0" }}>
        <div style={{ marginBottom: "3rem" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "300",
              letterSpacing: "2px",
              color: "#1a1a1a",
              marginBottom: "0.5rem",
            }}
          >
            {user && user.role === "admin" ? "Admin Account" : "My Account"}
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            {user && user.role === "admin"
              ? "Manage your admin account and access admin panel"
              : "Manage your account information and preferences"}
          </p>
        </div>

        <Row>
          <Col md="4">
            <div
              style={{
                border: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
                padding: "2rem",
                textAlign: "center",
                marginBottom: "2rem",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  backgroundColor: "#1a1a1a",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  fontWeight: "300",
                  margin: "0 auto 1.5rem",
                }}
              >
                {this.getInitials()}
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "500",
                  color: "#1a1a1a",
                  marginBottom: "0.5rem",
                }}
              >
                {this.state.firstName && this.state.lastName
                  ? `${this.state.firstName} ${this.state.lastName}`
                  : user?.username}
              </h3>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "0.875rem",
                  marginBottom: "0.5rem",
                }}
              >
                {user?.email}
              </p>
              <span
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.75rem",
                  backgroundColor: user?.role === "admin" ? "#1a1a1a" : "#f9fafb",
                  color: user?.role === "admin" ? "#ffffff" : "#1a1a1a",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {user?.role}
              </span>
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
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {user && user.role === "admin" ? (
                  <>
                    <button
                      onClick={() => this.setState({ activeTab: "dashboard" })}
                      style={{
                        padding: "0.75rem 1rem",
                        border: "none",
                        background:
                          activeTab === "dashboard" ? "#f9fafb" : "transparent",
                        color: "#1a1a1a",
                        textAlign: "left",
                        fontSize: "0.875rem",
                        fontWeight: activeTab === "dashboard" ? "500" : "400",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => this.setState({ activeTab: "profile" })}
                      style={{
                        padding: "0.75rem 1rem",
                        border: "none",
                        background:
                          activeTab === "profile" ? "#f9fafb" : "transparent",
                        color: "#1a1a1a",
                        textAlign: "left",
                        fontSize: "0.875rem",
                        fontWeight: activeTab === "profile" ? "500" : "400",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => this.setState({ activeTab: "password" })}
                      style={{
                        padding: "0.75rem 1rem",
                        border: "none",
                        background:
                          activeTab === "password" ? "#f9fafb" : "transparent",
                        color: "#1a1a1a",
                        textAlign: "left",
                        fontSize: "0.875rem",
                        fontWeight: activeTab === "password" ? "500" : "400",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      Change Password
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => this.setState({ activeTab: "profile" })}
                      style={{
                        padding: "0.75rem 1rem",
                        border: "none",
                        background:
                          activeTab === "profile" ? "#f9fafb" : "transparent",
                        color: "#1a1a1a",
                        textAlign: "left",
                        fontSize: "0.875rem",
                        fontWeight: activeTab === "profile" ? "500" : "400",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => this.setState({ activeTab: "contact" })}
                      style={{
                        padding: "0.75rem 1rem",
                        border: "none",
                        background:
                          activeTab === "contact" ? "#f9fafb" : "transparent",
                        color: "#1a1a1a",
                        textAlign: "left",
                        fontSize: "0.875rem",
                        fontWeight: activeTab === "contact" ? "500" : "400",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      Contact Information
                    </button>
                    <button
                      onClick={() => this.setState({ activeTab: "password" })}
                      style={{
                        padding: "0.75rem 1rem",
                        border: "none",
                        background:
                          activeTab === "password" ? "#f9fafb" : "transparent",
                        color: "#1a1a1a",
                        textAlign: "left",
                        fontSize: "0.875rem",
                        fontWeight: activeTab === "password" ? "500" : "400",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      Change Password
                    </button>
                    <button
                      onClick={() => this.setState({ activeTab: "orders" })}
                      style={{
                        padding: "0.75rem 1rem",
                        border: "none",
                        background:
                          activeTab === "orders" ? "#f9fafb" : "transparent",
                        color: "#1a1a1a",
                        textAlign: "left",
                        fontSize: "0.875rem",
                        fontWeight: activeTab === "orders" ? "500" : "400",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      Order History
                    </button>
                  </>
                )}
              </div>
            </div>
          </Col>

          <Col md="8">
            {activeTab === "dashboard" && user && user.role === "admin" && (
              <div style={{ marginBottom: "2rem" }}>
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
                  Dashboard Overview
                </h3>
                <Row className="g-3">
                  <Col md="4" sm="6">
                    <div
                      style={{
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#ffffff",
                        padding: "1.5rem",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "2rem", fontWeight: "600", color: "#1a1a1a", marginBottom: "0.5rem" }}>
                        {this.getAdminStatistics().totalOrders}
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Total Orders
                      </div>
                    </div>
                  </Col>
                  <Col md="4" sm="6">
                    <div
                      style={{
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#ffffff",
                        padding: "1.5rem",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "2rem", fontWeight: "600", color: "#1a1a1a", marginBottom: "0.5rem" }}>
                        ${this.getAdminStatistics().totalRevenue.toFixed(2)}
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Total Revenue
                      </div>
                    </div>
                  </Col>
                  <Col md="4" sm="6">
                    <div
                      style={{
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#ffffff",
                        padding: "1.5rem",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "2rem", fontWeight: "600", color: "#92400e", marginBottom: "0.5rem" }}>
                        {this.getAdminStatistics().pendingOrders}
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Pending Orders
                      </div>
                    </div>
                  </Col>
                  <Col md="4" sm="6">
                    <div
                      style={{
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#ffffff",
                        padding: "1.5rem",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "2rem", fontWeight: "600", color: "#1a1a1a", marginBottom: "0.5rem" }}>
                        {this.getAdminStatistics().totalProducts}
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Total Products
                      </div>
                    </div>
                  </Col>
                  <Col md="4" sm="6">
                    <div
                      style={{
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#ffffff",
                        padding: "1.5rem",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "2rem", fontWeight: "600", color: "#1a1a1a", marginBottom: "0.5rem" }}>
                        {this.getAdminStatistics().totalUsers}
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Total Users
                      </div>
                    </div>
                  </Col>
                  <Col md="4" sm="6">
                    <div
                      style={{
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#ffffff",
                        padding: "1.5rem",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "2rem", fontWeight: "600", color: "#ef4444", marginBottom: "0.5rem" }}>
                        {this.getAdminStatistics().lowStockProducts}
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Low Stock Products
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
            {activeTab === "profile" && (
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
                  Profile Information
                </h3>

                <Form onSubmit={this.handleProfileSave}>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label
                          for="firstName"
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            color: "#1a1a1a",
                            marginBottom: "0.5rem",
                          }}
                        >
                          First Name
                        </Label>
                        <Input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={this.state.firstName}
                          onChange={this.handleProfileChange}
                          style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "0",
                            padding: "0.75rem",
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label
                          for="lastName"
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            color: "#1a1a1a",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Last Name
                        </Label>
                        <Input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={this.state.lastName}
                          onChange={this.handleProfileChange}
                          style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "0",
                            padding: "0.75rem",
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <FormGroup>
                    <Label
                      for="username"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#1a1a1a",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Username
                    </Label>
                    <Input
                      type="text"
                      name="username"
                      id="username"
                      value={user?.username || ""}
                      disabled
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "0",
                        padding: "0.75rem",
                        backgroundColor: "#f9fafb",
                        color: "#6b7280",
                      }}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label
                      for="email"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#1a1a1a",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Email
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      value={user?.email || ""}
                      disabled
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "0",
                        padding: "0.75rem",
                        backgroundColor: "#f9fafb",
                        color: "#6b7280",
                      }}
                    />
                  </FormGroup>

                  <Button
                    type="submit"
                    className="btn-modern"
                    style={{ marginTop: "1rem" }}
                  >
                    Save Changes
                  </Button>
                </Form>
              </div>
            )}

            {activeTab === "contact" && user && user.role !== "admin" && (
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
                  Contact Information
                </h3>

                <Form onSubmit={this.handleProfileSave}>
                  <FormGroup>
                    <Label
                      for="phone"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#1a1a1a",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Phone
                    </Label>
                    <Input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={this.state.phone}
                      onChange={this.handleProfileChange}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "0",
                        padding: "0.75rem",
                      }}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label
                      for="address"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#1a1a1a",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Address
                    </Label>
                    <Input
                      type="text"
                      name="address"
                      id="address"
                      value={this.state.address}
                      onChange={this.handleProfileChange}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "0",
                        padding: "0.75rem",
                      }}
                    />
                  </FormGroup>

                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label
                          for="city"
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            color: "#1a1a1a",
                            marginBottom: "0.5rem",
                          }}
                        >
                          City
                        </Label>
                        <Input
                          type="text"
                          name="city"
                          id="city"
                          value={this.state.city}
                          onChange={this.handleProfileChange}
                          style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "0",
                            padding: "0.75rem",
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Label
                          for="zipCode"
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            color: "#1a1a1a",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Zip Code
                        </Label>
                        <Input
                          type="text"
                          name="zipCode"
                          id="zipCode"
                          value={this.state.zipCode}
                          onChange={this.handleProfileChange}
                          style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "0",
                            padding: "0.75rem",
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Label
                          for="country"
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            color: "#1a1a1a",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Country
                        </Label>
                        <Input
                          type="text"
                          name="country"
                          id="country"
                          value={this.state.country}
                          onChange={this.handleProfileChange}
                          style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "0",
                            padding: "0.75rem",
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Button
                    type="submit"
                    className="btn-modern"
                    style={{ marginTop: "1rem" }}
                  >
                    Save Changes
                  </Button>
                </Form>
              </div>
            )}

            {activeTab === "password" && (
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
                  Change Password
                </h3>

                <Form onSubmit={this.handlePasswordSave}>
                  <FormGroup>
                    <Label
                      for="currentPassword"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#1a1a1a",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Current Password
                    </Label>
                    <Input
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      value={this.state.currentPassword}
                      onChange={this.handlePasswordChange}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "0",
                        padding: "0.75rem",
                      }}
                    />
                    {this.state.passwordErrors.currentPassword && (
                      <div
                        style={{
                          color: "#ef4444",
                          fontSize: "0.75rem",
                          marginTop: "0.25rem",
                        }}
                      >
                        {this.state.passwordErrors.currentPassword}
                      </div>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label
                      for="newPassword"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#1a1a1a",
                        marginBottom: "0.5rem",
                      }}
                    >
                      New Password
                    </Label>
                    <Input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      value={this.state.newPassword}
                      onChange={this.handlePasswordChange}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "0",
                        padding: "0.75rem",
                      }}
                    />
                    {this.state.passwordErrors.newPassword && (
                      <div
                        style={{
                          color: "#ef4444",
                          fontSize: "0.75rem",
                          marginTop: "0.25rem",
                        }}
                      >
                        {this.state.passwordErrors.newPassword}
                      </div>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label
                      for="confirmPassword"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#1a1a1a",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Confirm New Password
                    </Label>
                    <Input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={this.state.confirmPassword}
                      onChange={this.handlePasswordChange}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "0",
                        padding: "0.75rem",
                      }}
                    />
                    {this.state.passwordErrors.confirmPassword && (
                      <div
                        style={{
                          color: "#ef4444",
                          fontSize: "0.75rem",
                          marginTop: "0.25rem",
                        }}
                      >
                        {this.state.passwordErrors.confirmPassword}
                      </div>
                    )}
                  </FormGroup>

                  <Button
                    type="submit"
                    className="btn-modern"
                    style={{ marginTop: "1rem" }}
                  >
                    Change Password
                  </Button>
                </Form>
              </div>
            )}

            {activeTab === "orders" && user && user.role !== "admin" && (
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
                  Order History
                </h3>

                {this.getUserOrders().length > 0 ? (
                  <div>
                    {this.getUserOrders()
                      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
                      .map((order) => (
                        <Link
                          key={order.id}
                          to={`/order/${order.id}`}
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                            display: "block",
                          }}
                        >
                          <div
                            style={{
                              border: "1px solid #e5e7eb",
                              padding: "1.5rem",
                              marginBottom: "1.5rem",
                              backgroundColor: "#ffffff",
                              transition: "all 0.2s ease",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#1a1a1a";
                              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "#e5e7eb";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                marginBottom: "1rem",
                                flexWrap: "wrap",
                                gap: "1rem",
                              }}
                            >
                              <div>
                                <div
                                  style={{
                                    fontSize: "0.875rem",
                                    fontWeight: "600",
                                    color: "#1a1a1a",
                                    marginBottom: "0.25rem",
                                  }}
                                >
                                  Order #{order.orderNumber}
                                </div>
                                <div
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "#6b7280",
                                  }}
                                >
                                  {this.formatDate(order.orderDate)}
                                </div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div
                                  style={{
                                    fontSize: "0.875rem",
                                    fontWeight: "600",
                                    color: "#1a1a1a",
                                    marginBottom: "0.25rem",
                                  }}
                                >
                                  ${order.pricing.total.toFixed(2)}
                                </div>
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "0.25rem 0.75rem",
                                    backgroundColor:
                                      order.status === "pending"
                                        ? "#fef3c7"
                                        : order.status === "shipped"
                                          ? "#dbeafe"
                                          : order.status === "delivered"
                                            ? "#d1fae5"
                                            : "#f3f4f6",
                                    color:
                                      order.status === "pending"
                                        ? "#92400e"
                                        : order.status === "shipped"
                                          ? "#1e40af"
                                          : order.status === "delivered"
                                            ? "#065f46"
                                            : "#6b7280",
                                    fontSize: "0.75rem",
                                    fontWeight: "600",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                  }}
                                >
                                  {order.status}
                                </span>
                              </div>
                            </div>

                            <div
                              style={{
                                borderTop: "1px solid #e5e7eb",
                                paddingTop: "1rem",
                                marginTop: "1rem",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "0.875rem",
                                  fontWeight: "500",
                                  color: "#1a1a1a",
                                  marginBottom: "0.75rem",
                                }}
                              >
                                Items ({order.items.length})
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {order.items.map((item, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      padding: "0.5rem 0",
                                      fontSize: "0.875rem",
                                      color: "#6b7280",
                                    }}
                                  >
                                    <span>
                                      {item.productName} x {item.quantity}
                                    </span>
                                    <span style={{ fontWeight: "500", color: "#1a1a1a" }}>
                                      ${item.totalPrice.toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {order.couponCode && (
                              <div
                                style={{
                                  marginTop: "0.75rem",
                                  paddingTop: "0.75rem",
                                  borderTop: "1px solid #f3f4f6",
                                  fontSize: "0.75rem",
                                  color: "#6b7280",
                                }}
                              >
                                Coupon applied: <strong>{order.couponCode}</strong>
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "3rem 2rem",
                      color: "#6b7280",
                    }}
                  >
                    <p style={{ fontSize: "0.875rem", margin: 0 }}>
                      No orders yet. Start shopping to see your order history here.
                    </p>
                    <Link
                      to="/"
                      style={{
                        display: "inline-block",
                        marginTop: "1.5rem",
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
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.authReducer,
    orders: state.orderReducer,
    products: state.productListReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      logout: bindActionCreators(authActions.logout, dispatch),
      getOrders: bindActionCreators(orderActions.getOrders, dispatch),
      getProducts: bindActionCreators(productActions.getProducts, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountWrapper);
