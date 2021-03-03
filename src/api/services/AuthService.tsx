import axios from "axios";
import { apiLinks } from "../../constants";

/**
 * This service manages authentication operations.
 */
export default class AuthService {
    static readonly API_BASE = "auth/";

    /**
     * Refreshes token.
     * 
     * @return {Promise<AxiosResponse<any>>} Promise with API response.
     */
    static refreshToken() {
        return axios.post(apiLinks.refreshToken);
    }

    /**
     * Logs the user out.
     * 
     * @return {Promise<AxiosResponse<any>>} Promise with API response.
     */
    static logout() {
        return axios.post(`${this.API_BASE}logout`);
    }
}