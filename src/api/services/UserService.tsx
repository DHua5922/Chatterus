import axios from "axios";

/**
 * This service manages user operations.
 */
export default class UserService {
    private static readonly API_BASE = "user/";

    /**
     * Creates a new account for the new user.
     * 
     * @param newUser New user information.
     * @return {Promise<AxiosResponse<any>>} Promise with API response.
     */
    static signUp(newUser) {
        return axios.post(`${this.API_BASE}signup`, newUser);
    }
}