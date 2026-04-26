import React, { useState, useEffect, useRef } from "react";
import axios from "../api/axios";
import { MessageSquare, Send, X, Bot, User } from "lucide-react";
import "./ChatBot.css";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = { role: "user", content: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post("/chat/ask", { question: message });
      const assistantMessage = { role: "assistant", content: response.data.answer };
      setChatHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>
              <Bot size={20} className="text-accent" />
              <span>Freedom Fighter AI</span>
              <div className="chatbot-status" title="Online"></div>
            </h3>
            <button className="modal-close" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="chatbot-messages">
            {chatHistory.length === 0 && (
              <div className="chat-message message-assistant">
                Namaste! I am your AI assistant. Ask me anything about Indian Freedom Fighters!
              </div>
            )}
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${
                  msg.role === "user" ? "message-user" : "message-assistant"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="chat-message message-assistant">
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-area" onSubmit={handleSend}>
            <input
              type="text"
              className="chatbot-input"
              placeholder="Ask a question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="chatbot-send" disabled={isLoading}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with AI"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}
