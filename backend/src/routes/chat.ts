import express from "express";
import ChatService from "../service/ChatService";
import auth from "../middleware/auth";
import TokenService from "../service/TokenService";
import ValidationService from "../service/ValidationService";

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

router.post("/newchat", auth, async (req, res) => {
    const { adminId, title } = req.body;
    if(!ValidationService.isValidChatName(title)) 
        res.status(400).json({ message: "Name cannot be empty" });
    return res
        .status(200)
        .json(await ChatService.createChat(adminId, title));
});

export default module.exports = router;