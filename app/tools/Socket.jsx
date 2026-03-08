import { io } from "socket.io-client";

export const socket = io("https://realtime-chatapp-backend-rfsk.onrender.com", {
  autoConnect: false,
  withCredentials: true,
});
