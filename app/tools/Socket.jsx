import { io } from "socket.io-client";

export const socket = io("https://realtime-chatapp-frontend-zd9r.onrender.com", {
  autoConnect: false,
  withCredentials: true,
});
