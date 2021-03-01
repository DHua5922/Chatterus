import axios from "axios";
import { apiLinks } from "../../constants";

/**
 * This service manages user operations.
 */
export default class UserService {
    static readonly API_BASE = "user/";

    /**
     * Creates a new account for the new user.
     * 
     * @param newUser New user information.
     * @return {Promise<AxiosResponse<any>>} Promise with API response.
     */
    static signUp(newUser) {
        return axios.post(`${this.API_BASE}signup`, newUser);
    }

    /**
     * Gets the user's profile.
     * 
     * @return {Promise<AxiosResponse<any>>} Promise with API response.
     */
    static getProfile() {
        return axios.get(apiLinks.profile);
    }

    /**
     * Updates the user's profile.
     * 
     * @param {{username: string, email: string}} updatedProfile New profile.
     * @return {Promise<AxiosResponse<any>>} Promise with API response.
     */
    static updateProfile(updatedProfile: {username: string, email: string}) {
        return axios.put(apiLinks.profile, updatedProfile);
    }

    /**
     * Deletes the user.
     * 
     * @return {Promise<AxiosResponse<any>>} Promise with API response.
     */
    static deleteUser() {
        return axios.delete(this.API_BASE);
    }
}