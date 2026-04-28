import React, { useState, useEffect, useRef } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Send, X, Bot, User, List, Info, ChevronRight, ExternalLink } from "lucide-react";
import "./ChatBot.css";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = { role: "user", content: message, type: "text" };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post("/chat/ask", { question: message });
      const assistantMessage = { 
        role: "assistant", 
        content: response.data.answer,
        type: response.data.type || "text",
        actions: response.data.actions || []
      };
      setChatHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again.", type: "text" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (msg) => {
    const renderActions = () => {
      if (!msg.actions || msg.actions.length === 0) return null;
      return (
        <div className="chat-actions" style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px'}}>
          {msg.actions.map((action, i) => (
            <button 
              key={i} 
              className="chat-action-btn"
              onClick={() => {
                navigate(action.path);
                setIsOpen(false);
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 12px', borderRadius: '8px',
                fontSize: '13px', fontWeight: '600',
                background: 'var(--bg-3)', border: '1px solid var(--border)',
                color: 'var(--accent)', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {action.label} <ExternalLink size={12} />
            </button>
          ))}
        </div>
      );
    };

    if (msg.type === "steps") {
      const steps = msg.content.split(/\n/).filter(line => line.trim().length > 0);
      return (
        <div className="steps-container">
          <p style={{marginBottom: '10px', fontWeight: '600'}}>Directions:</p>
          {steps.map((step, i) => (
            <div key={i} className="step-item">
              <div className="step-number">{i + 1}</div>
              <div className="step-text">{step.replace(/^\d+\.\s*/, '')}</div>
            </div>
          ))}
          {renderActions()}
        </div>
      );
    }

    if (msg.type === "info") {
      return (
        <div className="info-container">
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
            <Info size={16} />
            <strong>Knowledge Architecture:</strong>
          </div>
          <div className="info-content">{msg.content}</div>
          {renderActions()}
        </div>
      );
    }

    return (
      <div>
        {msg.content}
        {renderActions()}
      </div>
    );
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
                Namaste! I am your AI assistant. Ask me anything about Indian Freedom Fighters or how to use this app!
              </div>
            )}
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${
                  msg.role === "user" ? "message-user" : `message-assistant message-${msg.type}`
                }`}
              >
                {renderMessageContent(msg)}
              </div>
            ))}
            {isLoading && (
              <div className="chat-message message-assistant">
                Analyzing request...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-area" onSubmit={handleSend}>
            <input
              type="text"
              className="chatbot-input"
              placeholder="Ask about fighters or navigation..."
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
