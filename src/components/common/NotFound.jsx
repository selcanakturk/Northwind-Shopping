import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 1rem",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "500px" }}>
        <div
          style={{
            fontSize: "8rem",
            fontWeight: "300",
            color: "#1a1a1a",
            lineHeight: "1",
            marginBottom: "1rem",
            letterSpacing: "-0.02em",
          }}
        >
          404
        </div>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "300",
            letterSpacing: "2px",
            color: "#1a1a1a",
            marginBottom: "1rem",
          }}
        >
          Page Not Found
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "#6b7280",
            marginBottom: "2rem",
            lineHeight: "1.6",
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
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
            Go to Homepage
          </Link>
          <Link
            to="/"
            onClick={() => window.history.back()}
            style={{
              display: "inline-block",
              padding: "0.75rem 2rem",
              backgroundColor: "transparent",
              color: "#1a1a1a",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              border: "1px solid #1a1a1a",
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
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
