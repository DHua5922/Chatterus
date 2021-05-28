import axios from "axios";
import { apiLinks } from "../../constants";

/**
 * This service manages chat operations.
 */
export default class ChatService {
    static readonly API_BASE: string = "chat/";

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
    
    static createChat(adminId: string, title: string) {
        return axios.post(apiLinks.createChat, {
            adminId,
            title
        });
    }
}