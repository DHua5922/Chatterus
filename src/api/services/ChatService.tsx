import axios from "axios";

/**
 * This service manages chat operations.
 */
export default class ChatService {
    private static readonly API_BASE: string = "chat/";

    static getChats() {
        return axios.get(`${this.API_BASE}getchats`);
    }

    /**
     * Gets the chat with the id.
     * 
     * @param {string} id Chat id.
     * @returns {Promise<AxiosResponse<any>>} Chat API response.
     */
    static getChat(id: string) {
        return axios.get(this.API_BASE + id);
    }
}