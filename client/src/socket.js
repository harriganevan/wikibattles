import { io } from "socket.io-client";

const socket = io('https://wikibattles-api.onrender.com', {
    autoConnect: false,
});

export default socket;