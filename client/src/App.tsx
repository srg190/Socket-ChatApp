import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import ChatPage from "./pages/Chat/Chat";
import socketIO from "socket.io-client";
// import { ToastContainer, toast } from 'react-toastify';

const WS = "http://localhost:4000";
const socket = socketIO(WS);
function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home socket={socket} />}></Route>
          <Route path="/chat" element={<ChatPage socket={socket} />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
