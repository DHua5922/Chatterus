import express from "express";
import TokenService from "../service/TokenService";
import UserService from "../service/UserService";
import { format } from "date-fns";

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

export default module.exports = router;