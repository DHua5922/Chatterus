import express from "express";
import ChatService from "../service/ChatService";
import auth from "../middleware/auth";
import TokenService from "../service/TokenService";

const router = express.Router();

router.get("/getchats", auth, async (req, res) => {
    const token = TokenService.getAccessTokenInRequest(req);
    const userId = TokenService.getUserIdFromToken(token);
    res.status(200).json(await ChatService.getUserChats(userId));
});

router.get("/:id", auth, async (req, res) => {
    const chatId = req.params.id;
    res.status(200).json(await ChatService.getChat(chatId));
});

export default module.exports = router;