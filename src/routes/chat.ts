import express from "express";
import auth from "../middleware/auth";
import TokenService from "../service/TokenService";

const router = express.Router();

router.get("/getchats", auth, (req, res) => {
    res.status(200).json({
        id: TokenService.decryptToken(TokenService.getAccessTokenInRequest(req)),
    })
});

export default module.exports = router;