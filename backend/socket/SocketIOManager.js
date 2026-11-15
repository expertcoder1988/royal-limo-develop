import { Server } from "socket.io";
import { FRONT_END_BASE_URL } from "../utils/constants.js";

let ioInstance;

export const initSocketIO = (server) => {
  ioInstance = new Server(server, {
    cors: {
      origin: FRONT_END_BASE_URL,
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  ioInstance.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

export const sendNotification = (heading, data) => {
  if (ioInstance) {
    ioInstance.emit("new_notification", { heading: heading, data: data });
    console.log("Message Emitted:" + data + heading);
  } else {
    console.error("Socket.IO not initialized");
  }
};
