import express from "express";
import UserService from "../service/UserService";
import jwt from "jsonwebtoken";
import global from "../global";
import ValidationService from "../service/ValidationService";

const router = express.Router();

router.post("/signup", async (req, res) => {
    const {
        username,
        email,
        password,
        cpassword,
    } = req.body;

    const responseMsg = {
        username_error: [] as string[],
        email_error: [] as string[],
        password_error: [] as string[],
    };

    // Check for errors in username, email, and password
    if(!ValidationService.isValidUsername(username)) {
        // Invalid username
        responseMsg.username_error.push(global.messages.username.invalid_length);
    }
    if(await UserService.getUserByUsername(username)) {
        // Username already exists
        responseMsg.username_error.push(global.messages.username.already_exists);
    }
    if(!ValidationService.isValidEmail(email)) {
        // Invalid email
        responseMsg.email_error.push(global.messages.email.invalid);
    }
    if(await UserService.getUserByEmail(email)) {
        // Email already exists
        responseMsg.email_error.push(global.messages.email.already_exists);
    }
    if(!ValidationService.isValidPasswordLength(password)) {
        // Invalid password length
        responseMsg.password_error.push(global.messages.password.invalid_length);
    }
    if(!ValidationService.isMatchingPassword(password, cpassword)) {
        // No matching passwords
        responseMsg.password_error.push(global.messages.password.no_match);
    }

    if(Object.values(responseMsg).some((errorMsgs: string[]) => errorMsgs.length > 0)) {
        // Invalid new user information
        return res.status(400).json(responseMsg);
    }

    // Add new user to the database
    const user = await UserService.createUser(username, email, password);

    // Create jwt token for the new user
    const payload = {
        user: {
            id: user.id
        }
    };
    jwt.sign(
        payload,
        "randomString", {
            expiresIn: 10000
        },
        (err, token) => {
            if (err) throw err;
            res.status(200).json({
                token: token
            });
        }
    );
});

export default module.exports = router;