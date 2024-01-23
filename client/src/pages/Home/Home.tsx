import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  userRegistration,
  userActions,
  userLogin,
} from "../../redux/slices/userSlice";

const Home = ({ socket }: { socket: Socket }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.User);
  const [mode, setMode] = useState("signin");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem("userName", userName);
    localStorage.setItem("sender", socket.id || "");
    if (mode == "register") {
      dispatch(userRegistration({ email, userName, password }));
    } else {
      dispatch(userLogin({ email, userName, password }));
    }
    socket.emit("newUser", { userName, socketID: socket.id });
  };

  useEffect(() => {
    console.log(error, "fire hua bro ?");
    if (!loading && success) {
      navigate("/chat");
    }
  }, [dispatch, handleSubmit]);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <>
      <div>
        <form className="home__container" onSubmit={handleSubmit}>
          <h2 className="home__header">
            {mode === "register" ? "Register" : "Sign In"} to Open Chat
          </h2>
          <input
            type="text"
            minLength={6}
            name="username"
            className="username__input"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="username"
          />
          <input
            type="email"
            minLength={6}
            name="useremail"
            className="username__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
          />
          <input
            type="password"
            minLength={6}
            name="userpassword"
            className="username__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
          <button className="home__cta">
            {mode === "register" ? "Register" : "Sign In"}
          </button>
        </form>
      </div>
      <div className="toggle">
        <button
          onClick={() => setMode(mode === "register" ? "signin" : "register")}
        >
          {mode === "register"
            ? "Already have an account? Sign In"
            : "Don't have an account? Register"}
        </button>
      </div>
    </>
  );
};

export default Home;
