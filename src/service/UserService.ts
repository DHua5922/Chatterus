import User from "../model/User";
import bcrypt from "bcryptjs";

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
        const user = new User({
            username: username,
            email: email,
            password: await bcrypt.hash(password, salt),
        });
        await user.save();
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
}