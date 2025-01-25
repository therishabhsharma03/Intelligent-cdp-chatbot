import React, { useState } from "react";

const MessageInput = ({ onSendMessage }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput(""); // Reset the input field after sending the message
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a question"
        className="input-field"
      />
      <button type="submit" className="send-button">
        Send
      </button>
    </form>
  );
};

export default MessageInput;
