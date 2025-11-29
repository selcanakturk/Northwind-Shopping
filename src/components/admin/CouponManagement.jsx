import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Button, Input, Form, FormGroup, Label, Table } from "reactstrap";
import * as couponActions from "../../redux/actions/couponActions.jsx";
import alertify from "alertifyjs";

function CouponManagementWrapper(props) {
  const navigate = useNavigate();
  return <CouponManagement {...props} navigate={navigate} />;
}

class CouponManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      formData: {
        code: "",
        discount: "",
        discountType: "percentage",
        minPurchase: "",
        maxDiscount: "",
        validFrom: "",
        validUntil: "",
        isActive: true,
      },
      errors: {},
    };
  }

  componentDidMount() {
    if (!this.props.auth.isAuthenticated || this.props.auth.user.role !== "admin") {
      this.props.navigate("/");
      return;
    }
    this.props.actions.getCoupons();
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "discount" || name === "minPurchase" || name === "maxDiscount") {
      processedValue = value === "" ? "" : parseFloat(value);
      if (isNaN(processedValue)) {
        processedValue = value;
      }
    } else if (name === "isActive") {
      processedValue = e.target.checked;
    }

    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: processedValue,
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

    if (!formData.code.trim()) {
      errors.code = "Coupon code is required";
    }

    if (!formData.discount || formData.discount <= 0) {
      errors.discount = "Valid discount amount is required";
    }

    if (formData.discountType === "percentage" && formData.discount > 100) {
      errors.discount = "Percentage cannot exceed 100%";
    }

    if (formData.minPurchase < 0) {
      errors.minPurchase = "Minimum purchase cannot be negative";
    }

    if (formData.discountType === "percentage" && formData.maxDiscount && formData.maxDiscount < 0) {
      errors.maxDiscount = "Max discount cannot be negative";
    }

    if (!formData.validFrom) {
      errors.validFrom = "Valid from date is required";
    }

    if (!formData.validUntil) {
      errors.validUntil = "Valid until date is required";
    }

    if (formData.validFrom && formData.validUntil && new Date(formData.validFrom) > new Date(formData.validUntil)) {
      errors.validUntil = "Valid until must be after valid from";
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.validate()) {
      this.props.actions.createCoupon(this.state.formData);
      this.setState({
        showForm: false,
        formData: {
          code: "",
          discount: "",
          discountType: "percentage",
          minPurchase: "",
          maxDiscount: "",
          validFrom: "",
          validUntil: "",
          isActive: true,
        },
        errors: {},
      });
    }
  };

  handleDelete = (couponId) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      this.props.actions.deleteCoupon(couponId);
    }
  };

  toggleForm = () => {
    this.setState({ showForm: !this.state.showForm });
  };

  formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  isExpired = (validUntil) => {
    return new Date(validUntil) < new Date();
  };

  render() {
    const { coupons } = this.props;
    const { showForm, formData, errors } = this.state;

    if (!this.props.auth.isAuthenticated || this.props.auth.user.role !== "admin") {
      return null;
    }

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
              marginBottom: "1rem",
              display: "inline-block",
            }}
          >
            ← Back to Home
          </Link>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "300",
                letterSpacing: "2px",
                color: "#1a1a1a",
                margin: 0,
              }}
            >
              Coupon Management
            </h1>
            <Button
              onClick={this.toggleForm}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: showForm ? "#6b7280" : "#1a1a1a",
                color: "#ffffff",
                border: "none",
                fontSize: "0.875rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                transition: "background-color 0.2s ease",
              }}
            >
              {showForm ? "Cancel" : "Create New Coupon"}
            </Button>
          </div>
        </div>

        {showForm && (
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
              Create New Coupon
            </h3>
            <Form onSubmit={this.handleSubmit}>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label
                      for="code"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#1a1a1a",
                        marginBottom: "0.75rem",
                      }}
                    >
                      Coupon Code <span style={{ color: "#ef4444" }}>*</span>
                    </Label>
                    <Input
                      type="text"
                      name="code"
                      id="code"
                      value={formData.code}
                      onChange={this.handleChange}
                      style={{
                        border: errors.code ? "1px solid #ef4444" : "1px solid #e5e7eb",
                        borderRadius: "0",
                        padding: "0.875rem",
                        fontSize: "0.875rem",
                        textTransform: "uppercase",
                      }}
                      placeholder="WELCOME10"
                    />
                    {errors.code && (
                      <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                        {errors.code}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label
                      for="discountType"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#1a1a1a",
                        marginBottom: "0.75rem",
                      }}
                    >
                      Discount Type <span style={{ color: "#ef4444" }}>*</span>
                    </Label>
                    <Input
                      type="select"
                      name="discountType"
                      id="discountType"
                      value={formData.discountType}
                      onChange={this.handleChange}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "0",
                        padding: "0.875rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label
                      for="discount"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#1a1a1a",
                        marginBottom: "0.75rem",
                      }}
                    >
                      Discount{" "}
                      {formData.discountType === "percentage" ? "(%)" : "($)"}{" "}
                      <span style={{ color: "#ef4444" }}>*</span>
                    </Label>
                    <Input
                      type="number"
                      name="discount"
                      id="discount"
                      value={formData.discount}
                      onChange={this.handleChange}
                      min="0"
                      step={formData.discountType === "percentage" ? "1" : "0.01"}
                      style={{
                        border: errors.discount ? "1px solid #ef4444" : "1px solid #e5e7eb",
                        borderRadius: "0",
                        padding: "0.875rem",
                        fontSize: "0.875rem",
                      }}
                    />
                    {errors.discount && (
                      <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                        {errors.discount}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                {formData.discountType === "percentage" && (
                  <Col md="6">
                    <FormGroup>
                      <Label
                        for="maxDiscount"
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#1a1a1a",
                          marginBottom: "0.75rem",
                        }}
                      >
                        Max Discount ($)
                      </Label>
                      <Input
                        type="number"
                        name="maxDiscount"
                        id="maxDiscount"
                        value={formData.maxDiscount}
                        onChange={this.handleChange}
                        min="0"
                        step="0.01"
                        style={{
                          border: errors.maxDiscount ? "1px solid #ef4444" : "1px solid #e5e7eb",
                          borderRadius: "0",
                          padding: "0.875rem",
                          fontSize: "0.875rem",
                        }}
                        placeholder="Optional"
                      />
                      {errors.maxDiscount && (
                        <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                          {errors.maxDiscount}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                )}
              </Row>

              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label
                      for="minPurchase"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#1a1a1a",
                        marginBottom: "0.75rem",
                      }}
                    >
                      Minimum Purchase ($)
                    </Label>
                    <Input
                      type="number"
                      name="minPurchase"
                      id="minPurchase"
                      value={formData.minPurchase}
                      onChange={this.handleChange}
                      min="0"
                      step="0.01"
                      style={{
                        border: errors.minPurchase ? "1px solid #ef4444" : "1px solid #e5e7eb",
                        borderRadius: "0",
                        padding: "0.875rem",
                        fontSize: "0.875rem",
                      }}
                      placeholder="0"
                    />
                    {errors.minPurchase && (
                      <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                        {errors.minPurchase}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#1a1a1a",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <Input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={this.handleChange}
                        style={{ marginRight: "0.5rem" }}
                      />
                      Active
                    </Label>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label
                      for="validFrom"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#1a1a1a",
                        marginBottom: "0.75rem",
                      }}
                    >
                      Valid From <span style={{ color: "#ef4444" }}>*</span>
                    </Label>
                    <Input
                      type="datetime-local"
                      name="validFrom"
                      id="validFrom"
                      value={formData.validFrom}
                      onChange={this.handleChange}
                      style={{
                        border: errors.validFrom ? "1px solid #ef4444" : "1px solid #e5e7eb",
                        borderRadius: "0",
                        padding: "0.875rem",
                        fontSize: "0.875rem",
                      }}
                    />
                    {errors.validFrom && (
                      <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                        {errors.validFrom}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label
                      for="validUntil"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#1a1a1a",
                        marginBottom: "0.75rem",
                      }}
                    >
                      Valid Until <span style={{ color: "#ef4444" }}>*</span>
                    </Label>
                    <Input
                      type="datetime-local"
                      name="validUntil"
                      id="validUntil"
                      value={formData.validUntil}
                      onChange={this.handleChange}
                      style={{
                        border: errors.validUntil ? "1px solid #ef4444" : "1px solid #e5e7eb",
                        borderRadius: "0",
                        padding: "0.875rem",
                        fontSize: "0.875rem",
                      }}
                    />
                    {errors.validUntil && (
                      <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                        {errors.validUntil}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>

              <Button
                type="submit"
                style={{
                  padding: "0.875rem 2rem",
                  backgroundColor: "#1a1a1a",
                  color: "#ffffff",
                  border: "none",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Create Coupon
              </Button>
            </Form>
          </div>
        )}

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
            All Coupons
          </h3>
          {coupons && coupons.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Type</th>
                  <th>Min Purchase</th>
                  <th>Valid From</th>
                  <th>Valid Until</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td style={{ fontWeight: "600" }}>{coupon.code}</td>
                    <td>
                      {coupon.discountType === "percentage"
                        ? `${coupon.discount}%`
                        : `$${coupon.discount.toFixed(2)}`}
                      {coupon.maxDiscount && ` (max $${coupon.maxDiscount})`}
                    </td>
                    <td>{coupon.discountType === "percentage" ? "Percentage" : "Fixed"}</td>
                    <td>${coupon.minPurchase || 0}</td>
                    <td>{this.formatDate(coupon.validFrom)}</td>
                    <td>
                      {this.formatDate(coupon.validUntil)}
                      {this.isExpired(coupon.validUntil) && (
                        <span style={{ color: "#ef4444", marginLeft: "0.5rem", fontSize: "0.75rem" }}>
                          (Expired)
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          backgroundColor: coupon.isActive ? "#10b981" : "#6b7280",
                          color: "#ffffff",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          textTransform: "uppercase",
                        }}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <Button
                        onClick={() => this.handleDelete(coupon.id)}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#ef4444",
                          color: "#ffffff",
                          border: "none",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p style={{ color: "#6b7280", textAlign: "center", padding: "2rem" }}>
              No coupons found. Create your first coupon above.
            </p>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    coupons: state.couponReducer.coupons || [],
    auth: state.authReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      getCoupons: bindActionCreators(couponActions.getCoupons, dispatch),
      createCoupon: bindActionCreators(couponActions.createCoupon, dispatch),
      deleteCoupon: bindActionCreators(couponActions.deleteCoupon, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CouponManagementWrapper);

