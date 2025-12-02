import React, { Component } from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "4rem 2rem",
            textAlign: "center",
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              width: "100%",
            }}
          >
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "300",
                marginBottom: "1rem",
                color: "#1a1a1a",
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                color: "#6b7280",
                marginBottom: "2rem",
                fontSize: "0.875rem",
              }}
            >
              We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "0.75rem 2rem",
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
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#000000")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#1a1a1a")}
              >
                Refresh Page
              </button>
              <Link
                to="/"
                style={{
                  display: "inline-block",
                  padding: "0.75rem 2rem",
                  backgroundColor: "transparent",
                  color: "#1a1a1a",
                  border: "1px solid #1a1a1a",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#1a1a1a";
                  e.target.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#1a1a1a";
                }}
              >
                Go Home
              </Link>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details
                style={{
                  marginTop: "2rem",
                  textAlign: "left",
                  padding: "1rem",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  color: "#6b7280",
                }}
              >
                <summary style={{ cursor: "pointer", marginBottom: "0.5rem" }}>
                  Error Details (Development Only)
                </summary>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    margin: 0,
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

