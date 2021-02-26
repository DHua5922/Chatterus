import express from "express";
import UserService from "../service/UserService";
import ValidationService from "../service/ValidationService";
import global from "../global";
import CookieService from "../service/CookieService";
import TokenService from "../service/TokenService";

const router = express.Router();

router.post("/login", async (req, res) => {
    const {
        usernameOrEmail,
        password,
    } = req.body;

    const errorMsg = {
        message: global.messages.login.error as string,
    };

    const user: any = await UserService.getUserByEmailOrUsername(usernameOrEmail);
    if(user) {
        if(await ValidationService.isMatchingUserPassword(password, user.password)) {
            // Login if credentials are valid
            CookieService.createAccessCookie(res, TokenService.createPayload(user._id));
            CookieService.createRefreshCookie(res, TokenService.createPayload(user._id));
            res.status(200).json({
                message: global.messages.login.success as string,
            });
        } else {
            // Incorrect password
            res.status(400).json(errorMsg);
        }
    } else {
        // Incorrect username or email
        res.status(400).json(errorMsg);
    }
});

router.post("/refreshtoken", async (req, res) => {
    try {
        const refreshToken = TokenService.getRefreshTokenInRequest(req);
        const userId = TokenService.getUserIdFromToken(refreshToken);
        const tokenPayload = TokenService.createPayload(userId);
        CookieService.createAccessCookie(res, tokenPayload);
        CookieService.createRefreshCookie(res, tokenPayload);
        res.status(200).json({
            message: "Token has been refreshed.",
        });
    } catch(e) {
        res.status(401).json({
            message: "Invalid refresh token.",
        });
    }
});

export default module.exports = router;