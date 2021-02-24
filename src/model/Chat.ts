import mongoose from "mongoose";
import constants from "../global";

// field names must match exactly as the field names in collection conversations in MongoDb Atlas
const ChatSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    admin: {
        type: constants.mongo.ObjectId,
        ref: constants.mongo.Collections.User,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    messages: [{
        type: constants.mongo.ObjectId,
        default: [],
        ref: constants.mongo.Collections.Message
    }],
});

// export model conversation with ConversationSchema
// collection name in MongoDb Atlas is conversations
export default module.exports = mongoose.model(constants.mongo.Collections.Chat, ChatSchema);
