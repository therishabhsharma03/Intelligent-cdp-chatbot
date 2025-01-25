import React, { useState, useEffect } from "react";
import MessageInput from "./MessageInput";
import axios from "axios";
import "./ChatWindow.css";

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you with CDPs today?", sender: "bot" },
  ]);
  const [backendStatus, setBackendStatus] = useState(false); // Backend status
  const [teachingMode, setTeachingMode] = useState(null);
  const [loading, setLoading] = useState(false); // Typing indicator

  // Check backend status periodically
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        console.log("checked - u ");
        const response = await axios.get("https://intelligent-cdp-chatbot.onrender.com/status");
        console.log("checked - d ");
        if (response.data.status === "ready") {
          setBackendStatus(true);
        } else {
          setBackendStatus(false);
        }
      } catch {
        setBackendStatus(false);
      }
    };

    // Check status every 1 seconds
    const interval = setInterval(checkBackendStatus, 2500);
    checkBackendStatus(); // Initial check

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleSendMessage = async (userMessage) => {
    setMessages((prevMessages) => [...prevMessages, { text: userMessage, sender: "user" }]);
    setLoading(true);

    try {
      const response = await axios.post("https://intelligent-cdp-chatbot.onrender.com/ask", {
        question: userMessage,
      });

      const { answer } = response.data;
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: answer || "Sorry, I couldn't retrieve an answer.", sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error fetching the answer:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Sorry, I couldn't process your request. Please try again later.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-window">
      <div className="status-indicator">
        <div className={`status-light ${backendStatus ? "green" : "red"}`} />
        <span>
  {backendStatus
    ? "The backend is wide awake and ready to assist! 🟢"
    : "The backend is currently napping (Render free tier pauses services when idle). It may take up to 2 minutes to wake up! 🔴"}
</span>


      </div>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {loading && (
          <div className="message bot">
            <i>Typing...</i>
          </div>
        )}
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;
