import axios from "axios";

/**
 * This service manages authentication operations.
 */
export default class AuthService {
    private static readonly API_BASE = "auth/";

    /**
     * Signs the user in.
     * 
     * @param {any} userLogin Login information.
     * @return {Promise<AxiosResponse<any>>} Promise with API response.
     */
    static login(userLogin) {
        return axios.post(`${this.API_BASE}login`, userLogin);
    }
}