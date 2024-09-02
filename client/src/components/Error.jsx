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
    animation: "pulse 2s infinite", // Usa l'animazione pulsante
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
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(5.5); }
            100% { transform: scale(1); }
          }
        `}
      </style>
      <div style={hourglassStyle}>🤯</div>
      <div style={loadingTextStyle}>Error during Loading...</div>
    </div>
  );
};

export default Loading;
