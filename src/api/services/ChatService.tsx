import axios from "axios";

/**
 * This service manages chat operations.
 */
export default class ChatService {
    private static readonly API_BASE: string = "chat/";

    static getChats() {
        return axios.get(`${this.API_BASE}getchats`);
    }
}