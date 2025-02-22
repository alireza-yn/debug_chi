import { io } from "socket.io-client";

const socket = io(process.env.nodejs_server)

export default socket