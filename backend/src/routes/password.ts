import express from "express";
import TokenService from "../service/TokenService";
import UserService from "../service/UserService";
import { format } from "date-fns";
import ValidationService from "../service/ValidationService";
import PasswordService from "../service/PasswordService";
import constants from "../global";

const router = express.Router();

router.post("/email", async (req, res) => {
    const { email, resetPageUrl } = req.body;
    const errorMsg = {
        error: "Cannot send reset link to email. Please make sure the email is correct."
    };

    const user: any = await UserService.getUserByEmail(email);
    if(!user) 
        res.status(400).json(errorMsg);

    const token: string = await TokenService.createToken(TokenService.createPayload(user._id));
    const tokenInfo = await TokenService.decryptToken(token);
    const expDate = format(new Date(Date.now() + tokenInfo.exp / 1000), "PPpp");

    const mailjet = require('node-mailjet')
        .connect("977c831a455cec7c6d4c509d0acd452b", "ebe38830545cfd3c7c653d0f53b4193d");
    mailjet
        .post("send")
        .request({
            "FromEmail": "hua.dylan@gmail.com",
            "FromName": "Chatterus",
            "Recipients": [{
                "Email": email,
                "Name": user.username
            }],
            "Subject": "DO-NOT-REPLY: Password Reset Link",
            "HTML-part": `<p>Click <a href='${resetPageUrl}?token=${token}'>here</a> to reset your password. The link expires on ${expDate}.</p>`
        })
        .then(() => {
            res.status(200).json({
                success: `The link to resetting your password has been sent. Please check your email.`
            });
        })
        .catch(() => {
            res.status(400).json(errorMsg);
        })
});

router.post("/reset", async (req, res) => {
    const { token, password, cpassword } = req.body;

    // Check if new password is valid and link has not expired.
    if(!ValidationService.isValidPasswordLength(password)) {
        // Invalid password length
        res.status(400).json({
            message: constants.messages.password.invalid_length
        });
    }
    if(!ValidationService.isMatchingPassword(password, cpassword)) {
        // Password and confirm password do not match
        res.status(400).json({
            message: constants.messages.password.no_match
        });
    }
    if(!TokenService.decryptToken(token)) {
        res.status(401).json({
            message: "Link expired"
        });
    }

    // Update user's password with new password
    const userId: string = await TokenService.getUserIdFromToken(token);
    const encryptedPassword = await PasswordService.encryptPassword(password);
    await UserService.updatePassword(userId, encryptedPassword);
    res.status(200).json({
        message: "Your password has been updated."
    });
});

export default module.exports = router;