import mongoose from "mongoose";
import constants from "../global";

// field names must match exactly as the field names in collection messages in MongoDb Atlas
const MessageSchema = new mongoose.Schema({
    userId: {
        type: constants.mongo.ObjectId,
        ref: constants.mongo.Collections.User,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

// export model message with MessageSchema
// collection name in MongoDb Atlas is messages
export default module.exports = mongoose.model(constants.mongo.Collections.Message, MessageSchema);