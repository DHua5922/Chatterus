import { CookieOptions, Response } from "express";
import TokenService from "./TokenService";

/**
 * This service manages cookies.
 */
export default class CookieService {
    static ACCESS_COOKIE: string = "accessCookie";
    static REFRESH_COOKIE: string = "refreshCookie";
    private static cookieOptions: CookieOptions = { 
        httpOnly: true, 
        maxAge: 7 * 24 * 3600 * 1000, // expires in 1 week
        sameSite: "none",
        secure: true,
    };

    /**
     * Creates a new cookie with access token.
     * 
     * @param {Response} res Response that will be sent to the client.
     * @param {any} tokenPayload Information to put in token.
     * @param {CookieOptions} options Cookie options.
     */
    static createAccessCookie(
        res: Response, 
        tokenPayload: any, 
        options: CookieOptions=this.cookieOptions
    ) {
        const { maxAge, ...rest } = options;
        this.createCookie(
            res, 
            this.ACCESS_COOKIE, 
            TokenService.createToken(tokenPayload), 
            { 
                ...rest, 
                maxAge: 15 * 60 * 1000, // expires in 15 minutes
            },
        );
    }

    /**
     * Creates a new cookie with refresh token.
     * 
     * @param {Response} res Response that will be sent to the client.
     * @param {any} tokenPayload Information to put in token.
     * @param {CookieOptions} options Cookie options.
     */
    static createRefreshCookie(
        res: Response, 
        tokenPayload: any, 
        options: CookieOptions=this.cookieOptions
    ) {
        this.createCookie(
            res, 
            this.REFRESH_COOKIE, 
            TokenService.createToken(tokenPayload), 
            options
        );
    }

    /**
     * Creates a new cookie.
     * 
     * @param {Response} res Response that will be sent to the client.
     * @param {string} name Cookie label.
     * @param {any} value Cookie value.
     * @param {CookieOptions} options Cookie options.
     */
    static createCookie(
        res: Response, 
        name: string, 
        value: any,  
        options: CookieOptions=this.cookieOptions
    ) {
        res.cookie(name, value, options);
    }

    /**
     * Deletes the cookie storing the access token.
     * 
     * @param {Response} res Response that will be sent to the client. 
     */
    static deleteAccessCookie(res: Response) {
        this.deleteCookie(res, this.ACCESS_COOKIE);
    }

    /**
     * Deletes the cookie storing the refresh token.
     * 
     * @param {Response} res Response that will be sent to the client. 
     */
    static deleteRefreshCookie(res: Response) {
        this.deleteCookie(res, this.REFRESH_COOKIE);
    }

    /**
     * Deletes the cookie with the given name in the request.
     * 
     * @param {Response} res Response that will be sent to the client. 
     */
    static deleteCookie(res: Response, name: string) {
        res.cookie(name, "", {maxAge: 0});
    }
}