import React, { useEffect } from "react";

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    console.log("Modal isOpen:", isOpen, "at:", new Date().toLocaleTimeString());
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      console.log("Modal opening - body overflow hidden");
      document.body.style.overflow = 'hidden';
    } else {
      console.log("Modal closing - body overflow unset");
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) {
    console.log("Modal not rendering because isOpen is false");
    return null;
  }

  console.log("Modal rendering with children");

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        backdropFilter: "blur(4px)"
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          maxWidth: "90%",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          animation: "modalFadeIn 0.3s ease",
          position: "relative",
          margin: "20px"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Modal;