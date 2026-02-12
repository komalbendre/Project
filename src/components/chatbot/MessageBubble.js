import React from "react";

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          maxWidth: "75%",
          padding: "8px 12px",
          borderRadius: "12px",
          backgroundColor: isUser ? "#4f46e5" : "#f3f4f6",
          color: isUser ? "white" : "black",
          fontSize: "14px",
          lineHeight: "1.4",
        }}
      >
        {message.content}
      </div>
    </div>
  );
};

export default MessageBubble;
