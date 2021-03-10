import express from "express";
import dotenv from "dotenv";
import InitiateMongoServer from "./config/database";
import user from "./routes/user";
import auth from "./routes/authentication";
import cors from "cors";
import bodyParser from "body-parser";
import chat from "./routes/chat";
import cookieParser from "cookie-parser";
import password from "./routes/password";
import { Socket } from "socket.io";
import PastUser from "./model/PastUser";
import ChatService from "./service/ChatService";
import socketAuth from "./middleware/socket";

dotenv.config();

const app = express();

// Initiate Mongo Server
InitiateMongoServer();

// Read cookies
app.use(cookieParser());

// Allow chatterus website to use the API
const corsOptions = {
    origin: [
        "http://localhost:3000", 
        "https://chatterus-stage.herokuapp.com", 
        "https://chatterus-production.herokuapp.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], 
};
const corsConfig = cors(corsOptions);
app.options("/.*", corsConfig);
app.use(corsConfig);

// Middleware
app.use(bodyParser.json());

// Define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Node.js microservice is working now!");
});

// API routes
app.use("/user", user);
app.use("/auth", auth);
app.use("/chat", chat);
app.use("/password", password);

// Start the Express server
const PORT = process.env.PORT || 4000; // default port to listen
export const server = app.listen(PORT, () => {
    console.log(`Running at http://localhost:${PORT}`);
});

// enable real time communication
export const socket = require('socket.io');
export const io = socket(server, { cors: corsOptions });
io.use(socketAuth);
io.on('connection', (socket: Socket) => {
    /**
     * Invites users to the conversation.
     * @param {string} inviterId id of user inviting other users
     * @param {string[]} invitedIdList ids of users being invited
     * @param {Conversation} conversation conversation to invite users to
     */
     socket.on("INVITE_USERS", async (data) => {
        const { inviterId, invitedUsernameList, chatId } = data;
        
        PastUser.updateMany(
            { username: { $in: invitedUsernameList } },
            { $addToSet: { chats: chatId } },
            null,
            async (error: any, _: any) => {
                const errorResult = {
                    inviterId: inviterId,
                    message: "Cannot invite users"
                };

                if(error) {
                    io.emit("INVITE_USERS_ERROR", errorResult);
                }
                else {
                    io.emit("INVITE_USERS_SUCCESS", inviterId);
                    io.emit("ON_JOIN_CHAT", {
                        invitedUsernameList: invitedUsernameList,
                        chat: await ChatService.getChat(chatId)
                    });
                }
            }
        );
    })
});