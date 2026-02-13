import React, { useState } from "react";
import ChatbotWindow from "./ChatbotWindow";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          fontSize: "30px",
          cursor: "pointer",
          zIndex: 1000,
          background: "linear-gradient(135deg, white)",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 50px rgba(11, 58, 226, 0.7)",
          animation: "float 3s ease-in-out infinite",
        }}
      >
        ✨
      </div>


      {/* Chat Window */}
      {isOpen && <ChatbotWindow onClose={toggleChat} />}
    </>
  );
};

export default ChatbotWidget;
