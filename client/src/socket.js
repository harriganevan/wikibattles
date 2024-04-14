import { io } from "socket.io-client";

const socket = io('https://wikibattles-api.onrender.com/:3000', {
    autoConnect: false,
});

export default socket;