import Chat from "../model/Chat";
import Message from "../model/Message";
import constants from "../global";
import PastUser from "../model/PastUser";
import User from "../model/User";

export default class ChatService {
    /**
     * Gets all of the user's chats.
     * 
     * @param {string} id User id.
     * @return {any} User's chats. 
     */
    static getUserChats(id: string) {
        return PastUser.findById(id)
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
                            model: PastUser,
                            select: constants.mongo.includedUserFields // get username, email, date registered, and user's id
                        },
                    },
                ],
            });
    }

    /**
     * Gets the chat with the chat id.
     * 
     * @param {string} id Chat id.
     * @return {Promise<any>} Chat promise. 
     */
    static getChat(id: string) {
        return Chat.findById(id)
            .populate([
                {
                    // get all messages in each chat
                    path: "messages", // replace array of message ids with message information
                    model: Message,
                    populate: {
                        // get user information for message
                        path: "userId", // replace id of user with user information
                        model: PastUser,
                        select: constants.mongo.includedUserFields // get username, email, date registered, and user's id
                    },
                },
                {
                    path: "admin",
                    model: User,
                    select: constants.mongo.includedUserFields,
                }
            ]);
    }
}