import express, {
  Request,
  Response,
  RequestHandler,
  NextFunction,
} from "express";
import { Socket, Server } from "socket.io";
import cors from "cors";
import http from "http";
import userRoutes from "./routes/userRoutes";
import groupRoutes from "./routes/groupRoutes";
import messageRoutes from "./routes/messageRoutes";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errorMiddleware } from "./middleware/error";
import ErrorHandler from "./middleware/error";
import { sendToKafka } from "./kafka/kafkaController";
import { Message } from "./interface";

const app = express();
const PORT: Number = process.env.PORT ? parseInt(process.env.PORT) : 8000;
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

// Route.

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

////////////////////////////////////////////////////////////////

interface User {
  [key: string]: string;
}

let userToSocketMap: User = {};

io.on("connection", (socket: Socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  // socket.on("message", (data) => {
  //   io.emit("messageResponse", data);
  // });

  socket.on("newUser", (data) => {
    userToSocketMap[data.user.id] = data.socketID;
    io.emit("newUserResponse", userToSocketMap);
    // console.log(" here the users", userToSocketMap);
  });

  socket.on(
    "private-message",
    ({ recipitantId, message }: { recipitantId: string; message: Message }) => {
      const recipitantSocket = userToSocketMap[recipitantId];
      if (recipitantSocket) {
        io.to(recipitantSocket).emit("private-message", {
          sender: socket.id,
          message,
        });
        sendToKafka({
          recipitantId,
          text: message.text,
          sendById: message.sendBy.id,
        });
      } else {
        io.emit("error", "recipient not found");
        // console.log(`Recipient ${recipitantId} is not.`);
      }
    }
  );

  socket.on("join-group", ({ group }: { group: string }) => {
    const userId = Object.keys(userToSocketMap).find(
      (key) => userToSocketMap[key] === socket.id
    );
    socket.join(group);
    console.log(`User ${userId} joined the group`, group);
    io.to(group).emit("group-message", `User ${userId} joined the group`);
  });

  socket.on(
    "group-message",
    ({ group, message }: { group: string; message: Message }) => {
      // console.log(group, message);
      io.to(group).emit("group-message", { sender: socket.id, message });
    }
  );

  // socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Got The Data",
  });
});

app.get("/endpoint", (req: Request, res: Response) => {
  const userAgent = req.headers["user-agent"];
  console.log("User-Agent:", userAgent);
  // Further processing based on the userAgent
});

app.use("/api/v1", userRoutes);
app.use("/api/v1", groupRoutes);
app.use("/api/v1", messageRoutes);
app.use(
  (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    errorMiddleware(err, req, res, next);
  }
);

// kafkaController();

server.listen(PORT, () => {
  console.log("port is running on the " + PORT);
});
