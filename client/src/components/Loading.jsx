// Loading.jsx
import React from "react";

const Loading = () => {
  // Definisci gli stili usando oggetti JavaScript
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
    margin: 0,
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    flexDirection: "column",
  };

  const hourglassStyle = {
    fontSize: "100px",
    animation: "spin 2s infinite linear",
  };

  const loadingTextStyle = {
    marginTop: "20px",
    fontSize: "24px",
    color: "#333",
  };

  // Definisci la keyframe animation utilizzando un tag <style> all'interno del componente
  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={hourglassStyle}>⌛</div>
      <div style={loadingTextStyle}>Loading...</div>
    </div>
  );
};

export default Loading;
