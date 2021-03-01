import mongoose from "mongoose";
import constants from "../global";

// Field names must match exactly as the field names in collection past_users in MongoDb Atlas
const PastUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    chats: [{
        type: constants.mongo.ObjectId,
        ref: constants.mongo.Collections.Chat,
    }],
});

export default module.exports = mongoose.model(constants.mongo.Collections.PastUser, PastUserSchema);