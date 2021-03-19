import Chat from "../model/Chat";
import Message from "../model/Message";
import constants from "../global";
import PastUser from "../model/PastUser";
import User from "../model/User";
import UserService from "./UserService";
import MessageService from "./MessageService";

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

    /**
     * Creates a new chat.
     * 
     * @param {string} admin Chat admin id. 
     * @param {string} title Chat name.
     * @returns {Document<any>}
     */
    static async createChat(admin: string, title: string) {
        const newChat = new Chat({
            admin,
            title
        });
        await newChat.save();
        await UserService.createChat(admin, newChat._id);
        return newChat;
    }

    /**
     * Updates the chat.
     * 
     * @param {string} chatId Id of chat to update.
     * @param {string} title New chat title. 
     * @returns {Promise<any>}
     */
    static async updateChat(chatId: string, title: string) {
        return Chat.updateOne({_id: chatId}, {title});
    }

    /**
     * Deletes the chat.
     * 
     * @param {string} _id Id of chat to delete.
     * @returns {Promise<any>}
     */
     static async deleteChat(_id: string) {
        PastUser.updateMany({ chats: _id }, { $pull: { chats: _id } });
        return Chat.deleteOne({_id});
    }

    /**
     * Sends a new message in the chat.
     * 
     * @param {string} chatId Id of chat where new message was sent.
     * @param {string} userId Id of user who sent message.
     * @param {string} message Message.
     * @returns {Promise<any>}
     */
    static async sendMessage(chatId: string, userId: string, message: string) {
        const newMessage = await MessageService.createMessage(userId, message);
        return Chat.findByIdAndUpdate(
            { _id: chatId }, 
            { $addToSet: { messages: newMessage._id } }
        );
    }
}