import { io } from "socket.io-client";

let socket;

export const initSocket = () => {
  if (!socket) {
    socket = io(process.env.REACT_APP_SOCKET, {
      transports: ["websocket"],
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) throw new Error("Socket not initialized. Call initSocket() first.");
  return socket;
};

export default initSocket(); // default export for legacy code
