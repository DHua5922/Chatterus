import User from "../model/User";
import Chat from "../model/Chat";
import Message from "../model/Message";
import constants from "../global";
import UserService from "./UserService";

export default class ChatService {
    /**
     * Gets all of the user's chats.
     * 
     * @param {string} id User id.
     * @return {any} User's chats. 
     */
    static getUserChats(id: string) {
        return UserService.getUserById(id)
            // get all user fields except password and __v
            .select("-password -__v")
            .populate({
                // get user's chats
                path: "chats", // replace array of chat ids with chat data
                model: Chat,
                populate: [
                    {
                        // get all messages in each chat
                        path: "messages", // replace array of message ids with message information
                        model: Message,
                        populate: {
                            // get user information for message
                            path: "userId", // replace id of user with user information
                            model: User,
                            select: constants.mongo.includedUserFields // get username, email, date registered, and user's id
                        },
                    },
                ],
            });
    }
}