// import React from "react";
import { timeToReadable } from "../utilities/";

interface MessageContext {
  id: string;
  userName?: string;
  createAt: Date;
  text: string;
}
const Message = ({ id, userName, createAt, text }: MessageContext) => {
  return (
    <div className="message__chats" key={id}>
      <p>{userName ? userName : "You"}</p>
      <div className={!userName ? "message__sender" : "message__recipient"}>
        <p>{text}</p>
        <h6>{timeToReadable(createAt)}</h6>
      </div>
    </div>
  );
};
export default Message;
