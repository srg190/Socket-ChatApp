import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Group, Message, User, message } from "../../interface";
import Emitter from "../../event";
import { setCookie, timeOptions, timeToReadable } from "../../utilities";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { userLogout } from "../../redux/slices/userSlice";
import {
  getGroupConversation,
  getUserConversation,
} from "../../redux/slices/messageSlice";
import { Socket } from "socket.io-client";

const ChatBody = ({
  // messages,
  socket,
  lastMessageRef,
  typingStatus,
}: {
  // messages?: message[];
  socket: Socket;
  lastMessageRef: any;
  typingStatus: string;
}) => {
  const navigate = useNavigate();
  const [chatWith, setChatWith] = useState("");
  const dispatch = useAppDispatch();
  const { loading, error, success, user } = useAppSelector(
    (state) => state.User
  );
  const { messages } = useAppSelector((state) => state.Message);
  // const { data, setData } = useState<Message[]>([]);
  const handleLeaveChat = () => {
    localStorage.removeItem("userName");
    dispatch(userLogout());
    if (!loading && success && !error) {
      navigate("/");
      window.location.reload();
    }
  };

  useEffect(() => {
    Emitter.on("chatWith", (data: User | Group) => {
      if ("userName" in data) {
        dispatch(
          getUserConversation({
            recipientId: data.id,
          })
        );
        setChatWith(data.userName);
      } else {
        // 'data' is a Group
        dispatch(
          getGroupConversation({
            groupId: data.id,
          })
        );
        setChatWith(data.name);
      }
    });
    return () => {
      Emitter.off("chatWith");
    };
  }, []);

  useEffect(() => {
    socket.on("private-message", (data) =>
      console.log(data, " data from chat")
    );
  }, [socket]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <header className="chat__mainHeader">
        <p>Chatting with {chatWith}</p>
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          LEAVE CHAT
        </button>
      </header>

      <div className="message__container">
        {messages.map((message) =>
          message.sendBy.id === user.id ? (
            <div className="message__chats" key={message.id}>
              <p className="sender__name">You</p>
              <div className="message__sender">
                <p>{message.text}</p>
                <h6>{timeToReadable(message.createAt)}</h6>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={message.id}>
              <p>{message.sendBy.userName}</p>
              <div className="message__recipient">
                <p>{message.text}</p>
                <h6>{timeToReadable(message.createAt)}</h6>
              </div>
            </div>
          )
        )}

        <div className="message__status">
          <p>{typingStatus}</p>
        </div>
        <div ref={lastMessageRef} />
      </div>
    </>
  );
};

export default ChatBody;
