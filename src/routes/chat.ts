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

export default module.exports = router;