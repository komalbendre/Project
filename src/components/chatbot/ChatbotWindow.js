import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import MessageBubble from "./MessageBubble";

const ChatbotWindow = ({ onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const token = localStorage.getItem("token");

    // Load chat history on mount
    useEffect(() => {
        loadHistory();
    }, []);

    // Auto scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const loadHistory = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/chatbot/history",
                {
                    headers: { Authorization: `Bearer ${token}` },
                });

            const formatted = res.data.messages.map((msg) => ({
                role: msg.sender,
                content: msg.message,
            }));

            setMessages(formatted);
        } catch (err) {
            console.error("Error loading history:", err);
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await axios.post(
                "http://localhost:5000/api/chatbot/message",
                { message: input },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const botMessage = {
                role: "bot",
                content: res.data.reply,
            };

            setMessages((prev) => [...prev, botMessage]);

        } catch (err) {
            console.error("Error sending message:", err);
        }

        setLoading(false);
    };


    return (
        <div
            style={{
                position: "fixed",
                bottom: "90px",
                right: "20px",
                width: "350px",
                height: "500px",
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
                zIndex: 1000,
            }}
        >
            {/* Header */}
            <div
                style={{
                    background: "#4f46e5",
                    color: "white",
                    padding: "12px",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <span>Career Assistant</span>
                <button
                    onClick={onClose}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "white",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                >
                    ✖
                </button>
            </div>

            {/* Messages */}
            <div
                style={{
                    flex: 1,
                    padding: "10px",
                    overflowY: "auto",
                }}
            >
                {messages.map((msg, index) => (
                    <MessageBubble key={index} message={msg} />
                ))}

                {loading && <div>Typing...</div>}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
                style={{
                    display: "flex",
                    padding: "10px",
                    borderTop: "1px solid #ddd",
                }}
            >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about career..."
                    style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                    }}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />

                <button
                    onClick={sendMessage}
                    style={{
                        marginLeft: "8px",
                        padding: "8px 12px",
                        background: "#4f46e5",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatbotWindow;
