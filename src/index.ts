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

dotenv.config();

const app = express();

// Initiate Mongo Server
InitiateMongoServer();

// Read cookies
app.use(cookieParser());

// Allow chatterus website to use the API
const corsConfig = cors({
    origin: [
        "http://localhost:3000", 
        "https://chatterus-stage.herokuapp.com", 
        "https://chatterus-production.herokuapp.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], 
});
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
app.listen(PORT, () => {
    console.log(`Running at http://localhost:${PORT}`);
});