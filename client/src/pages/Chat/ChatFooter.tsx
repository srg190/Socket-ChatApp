import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import Emitter from "../../event";
import { Friend, Group, Message } from "../../interface";
import {
  userSendMessage,
  messageAction,
} from "../../redux/slices/messageSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";

const ChatFooter = ({ socket }: { socket: Socket }) => {
  const [message, setMessage] = useState("");
  const [componentReady, setComponentReady] = useState(false);
  const [data, setData] = useState<Friend | Group | null>(null);

  const { addMessage } = messageAction;
  const { user } = useAppSelector((state) => state.User);
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

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (componentReady && data) {
      const msg = {
        id: new Date().toLocaleString(),
        sendById: user.id,
        text: message,
        createAt: new Date(),
        sendBy: {
          id: user.id,
          email: user.email,
          userName: user.userName,
        },
      };
      if ((data as Friend).email) {
        dispatch(
          userSendMessage({
            recipitantId: data && data.id,
            text: message,
          })
        );
        dispatch(addMessage({ ...msg }));
        socket.emit("private-message", {
          message: msg,
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
        socket.emit("group-message", {
          message: msg,
          group: data && data.id,
        });
      }
    }
    setMessage("");
  };

  Emitter.on("chatWith", (data: Friend | Group) => {
    setData(data);
    setComponentReady(true);
  });

  useEffect(() => {
    const handlePrivateMessage = ({ message }: any) => {
      if (message) dispatch(addMessage({ ...message }));
    };

    const handleGroupMessage = ({ message }: any) => {
      if (message) dispatch(addMessage({ ...message }));
    };

    socket.on("private-message", handlePrivateMessage);
    socket.on("group-message", handleGroupMessage);

    return () => {
      socket.off("private-message", handlePrivateMessage);
      socket.off("group-message", handleGroupMessage);
    };
  }, [socket, dispatch]);

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
