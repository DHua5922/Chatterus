import User from "../model/User";
import bcrypt from "bcryptjs";
import PastUser from "../model/PastUser";

/**
 * This service manages users in the database.
 */
export default class UserService {
    /**
     * Gets the user by id.
     * 
     * @param {string} id User id.
     * @return {Promise<Document<any>>} Promise with user document object.
     */
    static getUserById(id: string) {
        return User.findById(id);
    }

    /**
     * Gets the user by email.
     * 
     * @param {string} email User's email.
     * @return {Promise<Document<any>>} Promise with user document object.
     */
    static async getUserByEmail(email: string) {
        return await User.findOne({
            email: email,
        });
    }

    /**
     * Gets the user by username.
     * 
     * @param {string} username User's username.
     * @return {Promise<Document<any>>} Promise with user document object.
     */
    static async getUserByUsername(username: string) {
        return await User.findOne({
            username: username,
        });
    }

    /**
     * Creates a new user by adding the user to the database.
     * 
     * @param {string} username Username.
     * @param {string} email Email.
     * @param {string} password Password.
     * @return {Promise<Document<any>>} Created user.
     */
    static async createUser(username: string, email: string, password: string) {
        const salt = await bcrypt.genSalt(10);
        const newUserInfo = {
            username: username,
            email: email,
            password: await bcrypt.hash(password, salt),
        };
        const user = new User(newUserInfo);
        const pastUser = new PastUser(newUserInfo);
        pastUser._id = user._id;
        await user.save();
        await pastUser.save();
        return user;
    } 

    /**
     * Gets the user by username or email.
     * 
     * @param {string} usernameOrEmail Username or email.
     * @return {Promise<Document<any>>}
     */
    static async getUserByEmailOrUsername(usernameOrEmail: string) {
        return User.findOne({ $or: [
            { email: usernameOrEmail },
            { username: usernameOrEmail },
        ]});
    }

    /**
     * Updates the user's profile.
     * 
     * @param {string} _id User id.
     * @param {{{username: string, email: string}}} newProfile New profile.
     * @return {Promise<Document<any>>}
     */
    static updateProfile(_id: string, newProfile: {username: string, email: string}) {
        return User.updateOne({_id}, newProfile);
    }

    /**
     * Deletes the user.
     * 
     * @param {string} _id User id.
     * @return {Promise<Document<any>>}
     */
    static async deleteUser(_id: string) {
        await PastUser.updateOne({_id}, await this.getUserById(_id));
        return User.deleteOne({_id});
    }

    /**
     * Updates the user's password.
     * 
     * @param {string} _id User id.
     * @param {string} password New password.
     * @return {Promise<any>}
     */
    static async updatePassword(_id: string, password: string) {
        return User.updateOne({_id}, {password});
    }

    /**
     * Adds the new chat id to the user's chat list.
     * 
     * @param {string} userId User id.
     * @param {string} newChatId New chat id.
     * @returns {Promise<Document<any>>}
     */
    static async createChat(userId: string, newChatId: string) {
        const user: any = await PastUser.findById(userId);
        user.chats.push(newChatId);
        return user.save();
    }

    /**
     * Gets all the users who have not been deleted.
     * 
     * @returns {Promise<Document<any>>} All the users who have not been deleted.
     */
    static async getAllActiveUsers() {
        return User.find({}).select("username _id");
    }
}