import React from "react";

const LoadingSpinner = ({ size = "medium", text = "Loading..." }) => {
  const sizeStyles = {
    small: { width: "30px", height: "30px", borderWidth: "3px" },
    medium: { width: "50px", height: "50px", borderWidth: "4px" },
    large: { width: "70px", height: "70px", borderWidth: "5px" },
  };

  const currentSize = sizeStyles[size] || sizeStyles.medium;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 2rem",
      }}
    >
      <div
        style={{
          width: currentSize.width,
          height: currentSize.height,
          border: `${currentSize.borderWidth} solid #e5e7eb`,
          borderTopColor: "#1a1a1a",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      {text && (
        <p
          style={{
            marginTop: "1rem",
            color: "#6b7280",
            fontSize: "0.875rem",
            fontWeight: "400",
          }}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;

