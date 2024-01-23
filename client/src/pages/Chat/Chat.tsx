import { Socket } from "socket.io-client";
import ChatBar from "./ChatBar";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import { useEffect, useState, useRef } from "react";
import { message } from "../../interface";
import { useAppSelector } from "../../redux/store";

const ChatPage = ({ socket }: { socket: Socket }) => {
  const [messages, setMessages] = useState<message[]>([]);
  const [typingStatus, setTypingStatus] = useState("");
  const lastMessageRef = useRef<null | HTMLElement>(null);
  const { loading } = useAppSelector((state) => state.User);

  useEffect(() => {
    socket.on("messageResponse", (data) => setMessages([...messages, data]));
  }, [socket, messages]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    socket.on("typingResponse", (data) => {
      data.includes("stop") ? setTypingStatus("") : setTypingStatus(data);
    });
  }, [socket]);

  return (
    <div className="chat">
      <ChatBar socket={socket} />
      <div className="chat__main">
        <ChatBody
          messages={messages}
          lastMessageRef={lastMessageRef}
          typingStatus={typingStatus}
        />
        <ChatFooter socket={socket} />
      </div>
    </div>
  );
};

export default ChatPage;
