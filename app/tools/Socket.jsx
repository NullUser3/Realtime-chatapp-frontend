import { io } from "socket.io-client";

export const socket = io("https://your-nextjs.onrender.com", {
  autoConnect: false,
  withCredentials: true,
});
