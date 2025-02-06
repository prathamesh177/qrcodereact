import React, { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

const QrScanner = () => {
  const [qrData, setQrData] = useState(null);
  const [videoRef, setVideoRef] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const canvasRef = useRef(null);

  const handleScan = (result) => {
    if (result) {
      setQrData(result.getText());
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const captureImage = () => {
    if (videoRef && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.drawImage(videoRef, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL("image/png"));
    }
  };

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    if (videoRef) {
      codeReader.decodeFromVideoDevice(null, videoRef, (result, err) => {
        if (result) {
          handleScan(result);
        } else if (err) {
          handleError(err);
        }
      });
    }

    return () => {
      codeReader.reset();
    };
  }, [videoRef]);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  };

  const videoStyle = {
    width: "100%",
    maxWidth: "480px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const buttonStyle = {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const qrDataStyle = {
    marginTop: "20px",
    textAlign: "left",
    width: "100%",
    maxWidth: "480px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const listItemStyle = {
    marginBottom: "8px",
    fontSize: "16px",
  };

  const footerStyle = {
    marginTop: "20px",
    fontSize: "14px",
    textAlign: "center",
    color: "#555",
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: "24px", textAlign: "center" }}>QR Code Scanner</h1>
      <video
        ref={(ref) => {
          if (ref) setVideoRef(ref);
        }}
        style={videoStyle}
        autoPlay
        playsInline
      />
      <canvas ref={canvasRef} style={{ display: "none" }} width="640" height="480"></canvas>
      {qrData && (
        <div style={qrDataStyle}>
          <p style={{ fontWeight: "bold", marginBottom: "10px" }}>QR Code Data:</p>
          <ul style={{ paddingLeft: "20px" }}>
            {qrData.split("\n").map((line, index) => (
              <li key={index} style={listItemStyle}>
                {line}
              </li>
            ))}
          </ul>
        </div>
      )}
      <footer style={footerStyle}>
        <b>© {new Date().getFullYear()} Prathamesh Walvekar. All rights reserved.</b>
      </footer>
    </div>
  );
};

export default QrScanner;
