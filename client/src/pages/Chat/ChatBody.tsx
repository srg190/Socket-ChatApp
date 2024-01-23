import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, message } from "../../interface";
import Emitter from "../../event";
import { setCookie } from "../../utilities";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { userLogout } from "../../redux/slices/userSlice";

const ChatBody = ({
  messages,
  lastMessageRef,
  typingStatus,
}: {
  messages: message[];
  lastMessageRef: any;
  typingStatus: string;
}) => {
  const navigate = useNavigate();
  const [chatWith, setChatWith] = useState(
    localStorage.getItem("recieverName") || "Broadcast"
  );
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.User);

  const handleLeaveChat = () => {
    localStorage.removeItem("userName");
    // localStorage.removeItem("recieverName");
    // localStorage.removeItem("recieverId");
    // localStorage.removeItem("sender");
    dispatch(userLogout());
    if (!loading && success && !error) {
      navigate("/");
      window.location.reload();
    }
  };

  useEffect(() => {
    Emitter.on("chatWith", (data: User) => {
      setChatWith(data.userName);
    });
  }, [chatWith, loading, error, success]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <header className="chat__mainHeader">
        <p>Hangout with {chatWith}</p>
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          LEAVE CHAT
        </button>
      </header>

      <div className="message__container">
        {messages.map((message) =>
          message.name === localStorage.getItem("userName") ? (
            <div className="message__chats" key={message.id}>
              <p className="sender__name">You</p>
              <div className="message__sender">
                <p>{message.text}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={message.id}>
              <p>{message.name}</p>
              <div className="message__recipient">
                <p>{message.text}</p>
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
