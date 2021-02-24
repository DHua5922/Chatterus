import jwt from "jsonwebtoken";
import CookieService from "./CookieService";

/**
 * This service manages tokens.
 * 
 * Information to put in the token is called a payload.
 * Payload should be in object format, so that it will be
 * easy to retrieve the information.
 */
export default class TokenService {
    private static readonly SECRET_KEY = "randomString";

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

    /**
     * Decrypts the token.
     * 
     * @param {string} token Encrypted token. 
     * @return {any} Token information.
     */
    static decryptToken(token: string): any {
        return jwt.verify(token, this.SECRET_KEY);
    }

    /**
     * Gets the access token in the request.
     * 
     * @param {any} req Request.
     * @return {string} Access token in the request.
     */
    static getAccessTokenInRequest(req: any) {
        return req.cookies[CookieService.ACCESS_COOKIE];
    }

    /**
     * Gets the refresh token in the request.
     * 
     * @param {any} req Request.
     * @return {string} Refresh token in the request. 
     */
    static getRefreshTokenInRequest(req: any) {
        return req.cookies[CookieService.REFRESH_COOKIE];
    }

    /**
     * Gets the user id in the token.
     * 
     * @param {string} token Encrypted token. 
     * @return {string} User id.
     */
    static getUserIdFromToken(token: string): string {
        return this.decryptToken(token).user.id;
    }
}