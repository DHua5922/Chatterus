import { createContext } from "react";
import { io, Socket } from "socket.io-client";
import { apiLinks } from "../constants";

export const socket: Socket = io(apiLinks.baseUrl);
export const SocketContext = createContext(socket);