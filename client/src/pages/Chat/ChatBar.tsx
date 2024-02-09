import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { Friend, Group, User } from "../../interface";
import eventEmitter from "../../event";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { userFriends } from "../../redux/slices/allUsersSlice";
import { addInGroup, createGroup } from "../../redux/slices/userSlice";
import { getGroupUsersList } from "../../redux/slices/groupSlice";
import { userCommonActions } from "../../redux/slices/commonSlice";

const ChatBar = ({ socket }: { socket: Socket }) => {
  const [groupName, setGroupName] = useState("");
  const [filterFriends, setFilterFriends] = useState<Friend[]>([]);
  const [selectFriend, setSelectFriend] = useState("");
  const [selectGroup, setSelectGroup] = useState("");

  const { users: Friends } = useAppSelector((state) => state.Friend);
  const { user } = useAppSelector((state) => state.User);
  const { users: groupUsers } = useAppSelector((state) => state.Group);
  const { setCurrentUser } = userCommonActions;

  const dispatch = useAppDispatch();

  const { groups: Groups } = user;

  const handleUser = (user: { socketID: string; userName: string }) => {
    if (localStorage.getItem("sender") !== user.socketID) {
      localStorage.setItem("recieverId", user.socketID);
      localStorage.setItem("recieverName", user.userName);
    }
  };

  const filteredFriends = () => {
    const filteredFriends = Friends.filter(
      (friend) => !groupUsers.some((user) => friend.id === user.id)
    );
    setFilterFriends(filteredFriends);
  };

  // const handleFriends = (friend: Friend) => {
  //   eventEmitter.emit("chatWith", friend);
  // };

  // const handleGroups = (groups: Group) => {
  //   eventEmitter.emit("chatWith", groups);
  // };

  const handleSelectGroup = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectGroup(e.target.value);
    dispatch(getGroupUsersList({ groupId: e.target.value }));
    // filteredFriends();
  };

  const handleCreateGroup = () => {
    if (groupName) dispatch(createGroup({ name: groupName }));
    setGroupName("");
  };

  const handleAddInGroup = () => {
    dispatch(addInGroup({ groupId: selectGroup, recipitantId: selectFriend }));
  };

  useEffect(() => {
    dispatch(userFriends());
  }, [dispatch]);

  useEffect(() => {
    if (groupUsers.length > 0) {
      filteredFriends();
    }
  }, [selectFriend, selectGroup, groupUsers]);

  return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>
      <div>
        <h4 className="chat__header">ACTIVE USERS</h4>
        <div className="chat__users chat_active">
          {Friends.map((friend) =>
            friend.id === user.id ? null : (
              <div className="user-box" key={friend.id}>
                <p onClick={() => dispatch(setCurrentUser(friend))}>
                  {friend.userName}
                </p>
                {friend.isOnline ? <div className="green__"></div> : null}
              </div>
            )
          )}
        </div>
      </div>
      <div>
        <h4 className="chat__header">ALL ACTIVE GROUPS</h4>
        <div className="chat__users">
          {Groups &&
            Groups.map((group) => (
              <div className="user-box" key={group.name}>
                <p onClick={() => dispatch(setCurrentUser(group))}>
                  {group.name}
                </p>
                <h6>{group.adminId === user.id ? "Owner" : ""}</h6>
              </div>
            ))}
        </div>
      </div>
      <div>
        <div className="group_container">
          <div className="group_name">
            <input
              className="input_group"
              placeholder="Enter Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <div className="group_name">
            <button className="button_" onClick={() => handleCreateGroup()}>
              Create Group
            </button>
          </div>
        </div>
        <div className="group_container">
          <div className="option_">
            <select
              className="option_select"
              onChange={(e) => handleSelectGroup(e)}
            >
              <option key={1}>Choose Group...</option>
              {Groups?.map((group, i) =>
                group.adminId === user.id ? (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ) : null
              )}
            </select>
          </div>
          <div className="option_">
            <select
              className="option_select"
              onChange={(e) => setSelectFriend(e.target.value)}
            >
              <option>Choose Member...</option>
              {filterFriends.map((friend, i) => (
                <option key={friend.id} value={friend.id}>
                  {friend.userName}
                </option>
              ))}
            </select>
          </div>
          <button className="button_" onClick={() => handleAddInGroup()}>
            Add In Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBar;
