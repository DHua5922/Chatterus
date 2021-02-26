import axios from "axios";
import { apiLinks } from "../../constants";

/**
 * This service manages authentication operations.
 */
export default class AuthService {
    static readonly API_BASE = "auth/";

    /**
     * Signs the user in.
     * 
     * @param {any} userLogin Login information.
     * @return {Promise<AxiosResponse<any>>} Promise with API response.
     */
    static login(userLogin) {
        return axios.post(`${this.API_BASE}login`, userLogin);
    }

    /**
     * Refreshes token.
     * 
     * @return {Promise<AxiosResponse<any>>} Promise with API response.
     */
    static refreshToken() {
        return axios.post(apiLinks.refreshToken);
    }
}