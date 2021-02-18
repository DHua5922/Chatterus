import express from "express";

const app = express();
const PORT = 4000; // default port to listen

// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send( "Node.js microservice is working now!" );
});

// start the Express server
app.listen(PORT, () => {
    console.log( `Running at http://localhost:${PORT}` );
});