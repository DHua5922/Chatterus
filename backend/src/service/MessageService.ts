import Message from "../model/Message";

export default class MessageService {
    /**
     * Creates a new message.
     * 
     * @param {string} userId Id of user who sent message. 
     * @param {string} message Message.
     * @returns {Promise<Document<any>>}
     */
    static async createMessage(userId: string, message: string) {
        const newMessage = new Message({
            userId,
            message,
            createdAt: Date.now()
        });
        return newMessage.save();
    }
}