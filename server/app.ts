import express, {
  Request,
  Response,
  RequestHandler,
  NextFunction,
} from "express";
import { Socket, Server } from "socket.io";
import cors from "cors";
import http from "http";
import { User } from "./interface";
import userRoutes from "./routes/userRoutes";
import groupRoutes from "./routes/groupRoutes";
import messageRoutes from "./routes/messageRoutes";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errorMiddleware } from "./middleware/error";
import ErrorHandler from "./middleware/error";

const app = express();
const PORT: Number = 4000;
const Root: "/" = "/";
let con: number = 0;
let connections: any = [];

app.use(cookieParser() as RequestHandler);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(
  (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    errorMiddleware(err, req, res, next);
  }
);
// Route.

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

////////////////////////////////////////////////////////////////

let users: User[] = [];
// users.push({ userName: "Broadcast" });

io.on("connection", (socket: Socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("message", (data) => {
    io.emit("messageResponse", data);
  });

  socket.on("newUser", (data) => {
    users.push(data);
    io.emit("newUserResponse", users);
  });

  socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    users = users.filter((user) => user.socketID !== socket.id);
    io.emit("newUserResponse", users);
    socket.disconnect();
  });

  socket.on(
    "private_message",
    ({ content, to }: { content: string; to: string }) => {
      const message = {
        content,
        from: socket.id,
        to,
      };
      socket.to(to).to(socket.id).emit("private_message", message);
      // messageStore.saveMessage(message);
    }
  );
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Got The Data",
  });
});

app.use("/api/v1", userRoutes);
app.use("/api/v1", groupRoutes);
app.use("/api/v1", messageRoutes);

server.listen(PORT, () => {
  console.log("port is running on the " + PORT);
});
