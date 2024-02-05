import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import Emitter from "../../event";
import { Friend, Group } from "../../interface";
import { userSendMessage } from "../../redux/slices/messageSlice";
import { useAppDispatch } from "../../redux/store";

const ChatFooter = ({ socket }: { socket: Socket }) => {
  const [message, setMessage] = useState("");
  const [componentReady, setComponentReady] = useState(false);
  // const [currChatWith, setCurrChatWith] = useState<"friend" | "group">(
  //   "friend"
  // );
  const [data, setData] = useState<Friend | Group | null>(null);
  const dispatch = useAppDispatch();

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

  Emitter.on("chatWith", (data: Friend | Group) => {
    // console.log("Hello World chatwith ---> ", data);
    setData(data);
    setComponentReady(true);
  });

  const sendMessage = () => {
    if (componentReady && data) {
      if ((data as Friend).email) {
        // setCurrChatWith("friend");
        dispatch(
          userSendMessage({
            recipitantId: data && data.id,
            text: message,
          })
        );
        socket.emit("private-message", {
          text: message,
          recipitantId: data && data.id,
        });
      } else {
        // setCurrChatWith("group");
        dispatch(
          userSendMessage({
            groupId: data && data.id,
            text: message,
          })
        );
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage();
    setMessage("");
    // if (message.trim() && localStorage.getItem("userName")) {
    // }
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
