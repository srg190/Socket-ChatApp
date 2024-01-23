import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import Emitter from "../../event";

const ChatFooter = ({ socket }: { socket: Socket }) => {
  const [message, setMessage] = useState("");

  const handleTyping = () =>
    socket.emit("typing", `${localStorage.getItem("userName")} is typing`);

  const handleStopTyping = async () => {
    await setTimeout(() => {
      socket.emit(
        "typing",
        `${localStorage.getItem("userName")} is stop typing`
      );
    }, 1000);
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem("userName")) {
      socket.emit("message", {
        text: message,
        name: localStorage.getItem("userName"),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      });
    }
    setMessage("");
  };

  return (
    <div className="chat__footer">
      <form className="form" onSubmit={(e) => handleSendMessage(e)}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
          onKeyUp={handleStopTyping}
        />
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;
