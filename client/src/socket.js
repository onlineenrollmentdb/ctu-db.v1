import {io} from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET, {
  transports: ["websocket"], // force websocket (avoids polling issues)
});

export default socket;