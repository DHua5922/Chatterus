import jwt from "jsonwebtoken";

/**
 * This service manages tokens.
 * 
 * Information to put in the token is called a payload.
 * Payload should be in object format, so that it will be
 * easy to retrieve the information.
 */
export default class TokenService {
    /**
     * Creates a token payload that has the given 
     * information to put in the token.
     * 
     * @param {string} userId User id.
     * @return {any} Token payload. 
     */
    static createPayload(userId: string): any {
        return {
            user: {
                id: userId,
            },
        };
    }

    /**
     * Creates a new token.
     * 
     * @param {any} payload Information to put in the token.
     * @return {string} New token. 
     */
    static createToken(payload: any): string {
        return jwt.sign(
            payload,
            "randomString", {
                expiresIn: 10000
            });
    }
}