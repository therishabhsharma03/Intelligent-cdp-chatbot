import React, { useState } from "react";
import MessageInput from "./MessageInput";
import axios from "axios";
import "./ChatWindow.css";

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you with CDPs today?", sender: "bot" },
  ]);
  const [teachingMode, setTeachingMode] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state for bot typing indicator

  const handleSendMessage = async (userMessage) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userMessage, sender: "user" },
    ]);

    setLoading(true); // Show typing indicator

    if (teachingMode) {
      try {
        await axios.post("http://localhost:5000/teach", {
          question: teachingMode.question,
          answer: userMessage,
          keywords: [],
        });
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Thank you! I've learned the new information.", sender: "bot" },
        ]);
        setTeachingMode(null);
      } catch (error) {
        console.error("Error teaching the bot:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Sorry, I couldn't save the new information. Please try again later.",
            sender: "bot",
          },
        ]);
      }
      setLoading(false); // Hide typing indicator
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/ask", {
        question: userMessage,
      });

      const { answer, message } = response.data;

      if (message === "Please provide the correct answer to add it to my knowledge.") {
        setTeachingMode({ question: userMessage });
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: message, sender: "bot" },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: formatBotMessage(answer), sender: "bot", isRich: true },
        ]);
      }
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
      setLoading(false); // Hide typing indicator
    }
  };

  const formatBotMessage = (message) => {
    // Format the message to include headings, bullet points, etc.
    return (
      <div className="bot-response">
        {message.split("\n").map((line, index) => {
          if (line.startsWith("* ")) {
            return (
              <li key={index} className="bot-list-item">
                {line.slice(2)}
              </li>
            );
          }
          if (line.trim().length === 0) {
            return <br key={index} />;
          }
          return <p key={index}>{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="chat-window">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.isRich ? msg.text : <p>{msg.text}</p>}
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
