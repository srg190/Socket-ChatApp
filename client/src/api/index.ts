const BASE_URL = "http://localhost:4000/api/v1";

export const Api = {
  Register: `${BASE_URL}/register`,
  Login: `${BASE_URL}/login`,
  Logout: `${BASE_URL}/logout`,
  Friends: `${BASE_URL}/allUsers`,
  Conversation: `${BASE_URL}/getConversation`,
  GroupConversation: `${BASE_URL}/getGroupDetails`,
  SendMessage: `${BASE_URL}/sendMessage`,
  CreateGroup: `${BASE_URL}/createGroup`,
  AddInGroup: `${BASE_URL}/addInGroup`,
  GroupUsersList: `${BASE_URL}/getGroupUsersList`,
}; /// clean
