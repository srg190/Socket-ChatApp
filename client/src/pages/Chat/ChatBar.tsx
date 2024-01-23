import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { User } from "../../interface";
import eventEmitter from "../../event";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { userFriends } from "../../redux/slices/allUsersSlice";

const ChatBar = ({ socket }: { socket: Socket }) => {
  const [users, setUsers] = useState<User[]>([]);
  const { users: Friends } = useAppSelector((state) => state.Friend);
  const dispatch = useAppDispatch();

  const handleUser = (user: { socketID: string; userName: string }) => {
    if (localStorage.getItem("sender") !== user.socketID) {
      localStorage.setItem("recieverId", user.socketID);
      localStorage.setItem("recieverName", user.userName);
    }
    eventEmitter.emit("chatWith", user);
  };
  console.log(Friends, "Friends");
  useEffect(() => {
    dispatch(userFriends());
  }, [dispatch]);

  useEffect(() => {
    socket.on("newUserResponse", (data) => setUsers(data));
  }, [socket, users]);
  return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>
      <div>
        <h4 className="chat__header">ACTIVE USERS</h4>
        <div className="chat__users">
          {users.map((user) => (
            <p onClick={() => handleUser(user)} key={user.socketID}>
              {user.userName}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBar;
