import React from "react";

const ErrorMessage = ({ message, onRetry, retryText = "Try Again" }) => {
  return (
    <div
      style={{
        padding: "3rem 2rem",
        textAlign: "center",
        backgroundColor: "#ffffff",
        border: "1px solid #fee2e2",
        borderRadius: "4px",
        margin: "2rem 0",
      }}
    >
      <div
        style={{
          fontSize: "3rem",
          marginBottom: "1rem",
          color: "#ef4444",
        }}
      >
        ⚠️
      </div>
      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: "500",
          color: "#1a1a1a",
          marginBottom: "0.5rem",
        }}
      >
        Error
      </h3>
      <p
        style={{
          color: "#6b7280",
          fontSize: "0.875rem",
          marginBottom: onRetry ? "1.5rem" : "0",
        }}
      >
        {message || "An error occurred. Please try again later."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
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
          {retryText}
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

