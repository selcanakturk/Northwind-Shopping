import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Form, FormGroup, Label } from "reactstrap";
import * as authActions from "../../redux/actions/authActions.jsx";
import alertify from "alertifyjs";

function LoginWrapper(props) {
  const navigate = useNavigate();
  return <Login {...props} navigate={navigate} />;
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errors: {},
      showRegister: false,
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: "",
      },
    });
  };

  validate = () => {
    const errors = {};

    if (!this.state.username.trim()) {
      errors.username = "Username is required";
    }

    if (!this.state.password.trim()) {
      errors.password = "Password is required";
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleLogin = async (e) => {
    e.preventDefault();

    if (!this.validate()) {
      return;
    }

    try {
      await this.props.actions.login(this.state.username, this.state.password);
      alertify.success("Login successful!");
      this.props.navigate("/");
    } catch (error) {
      alertify.error(error.message || "Invalid username or password");
    }
  };

  handleRegister = async (e) => {
    e.preventDefault();

    if (!this.validate()) {
      return;
    }

    if (!this.state.email || !this.state.email.trim()) {
      this.setState({
        errors: { ...this.state.errors, email: "Email is required" },
      });
      return;
    }

    try {
      await this.props.actions.register(
        this.state.username,
        this.state.email,
        this.state.password
      );
      alertify.success("Registration successful!");
      this.props.navigate("/");
    } catch (error) {
      alertify.error(error.message || "Registration failed");
    }
  };

  toggleMode = () => {
    this.setState({
      showRegister: !this.state.showRegister,
      errors: {},
      password: "",
    });
  };

  render() {
    const { showRegister, errors } = this.state;

    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 1rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            border: "1px solid #e5e7eb",
            padding: "2.5rem",
            backgroundColor: "#ffffff",
          }}
        >
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: "300",
                letterSpacing: "2px",
                color: "#1a1a1a",
                marginBottom: "0.5rem",
              }}
            >
              {showRegister ? "Create Account" : "Sign In"}
            </h2>
            <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
              {showRegister
                ? "Create a new account to get started"
                : "Welcome back! Please sign in to your account"}
            </p>
          </div>

          <Form onSubmit={showRegister ? this.handleRegister : this.handleLogin}>
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
                value={this.state.username}
                onChange={this.handleChange}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "0",
                  padding: "0.75rem",
                }}
              />
              {errors.username && (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: "0.75rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {errors.username}
                </div>
              )}
            </FormGroup>

            {showRegister && (
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
                  value={this.state.email || ""}
                  onChange={this.handleChange}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "0",
                    padding: "0.75rem",
                  }}
                />
                {errors.email && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "0.75rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {errors.email}
                  </div>
                )}
              </FormGroup>
            )}

            <FormGroup>
              <Label
                for="password"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#1a1a1a",
                  marginBottom: "0.5rem",
                }}
              >
                Password
              </Label>
              <Input
                type="password"
                name="password"
                id="password"
                value={this.state.password}
                onChange={this.handleChange}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "0",
                  padding: "0.75rem",
                }}
              />
              {errors.password && (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: "0.75rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {errors.password}
                </div>
              )}
            </FormGroup>

            <Button
              type="submit"
              className="btn-modern w-100"
              style={{
                marginTop: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              {showRegister ? "Create Account" : "Sign In"}
            </Button>
          </Form>

          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>
              {showRegister ? "Already have an account?" : "Don't have an account?"}{" "}
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  this.toggleMode();
                }}
                style={{
                  color: "#1a1a1a",
                  textDecoration: "underline",
                  fontWeight: "500",
                }}
              >
                {showRegister ? "Sign In" : "Create Account"}
              </Link>
            </p>
          </div>

          {!showRegister && (
            <div
              style={{
                marginTop: "2rem",
                paddingTop: "2rem",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "0.75rem",
                  textAlign: "center",
                  marginBottom: "1rem",
                }}
              >
                Demo Accounts:
              </p>
              <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                <div>Admin: admin / admin123</div>
                <div>User: user / user123</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.authReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      login: bindActionCreators(authActions.login, dispatch),
      register: bindActionCreators(authActions.register, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginWrapper);

