import bcrypt from "bcryptjs";

/**
 * This service manages passwords.
 */
export default class PasswordService {
    /**
     * Encrypts the password.
     * 
     * @param {string} password Unencrypted password.
     * @return {Promise<string>}
     */
    static async encryptPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
}