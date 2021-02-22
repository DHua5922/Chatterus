import bcrypt from "bcryptjs";

/**
 * This services manages validation.
 */
export default class ValidationService {
    static readonly USERNAME_LIMIT: number = 5;
    static readonly PASSWORD_LIMIT: number = 6;

    /**
     * Checks if the username has the minimum length.
     * 
     * @param {string} username Username.
     * @return {boolean} True if valid username, or false.
     */
    static isValidUsername(username: string): boolean {
        return username.length >= this.USERNAME_LIMIT;
    }

    /**
     * Checks if the email has valid format.
     * 
     * @param {string} email Email.
     * @return {boolean} True if valid email, or false.
     */
    static isValidEmail(email: string): boolean {
        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(email);
    }

    /**
     * Checks if the password has the minimum length.
     * 
     * @param {string} password Password.
     * @return {boolean} True if valid password, or false.
     */
    static isValidPasswordLength(password: string): boolean{
        return password.length >= this.PASSWORD_LIMIT;
    }

    /**
     * Checks if password and confirm password matches.
     * 
     * @param {string} password Password.
     * @param {string} cpassword Confirm password.
     * @return {boolean} True if password and confirm password matches, or false.
     */
    static isMatchingPassword(password: string, cpassword: string): boolean {
        return password === cpassword;
    }

    /**
     * Checks if the unencrypted password matches the encrypted password.
     * 
     * @param {string} password Unencrypted password.
     * @param {string} encryptedPassword Encrypted password.
     * @return {Promise<boolean>} Promise<true> if the unencrypted password 
     *      matches the encrypted password, or Promise<false>.
     */
    static async isMatchingUserPassword(
        password: string, 
        encryptedPassword: string
    ): Promise<boolean> {
        return bcrypt.compare(password, encryptedPassword);
    }
};