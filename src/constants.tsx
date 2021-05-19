import AuthService from "./api/services/AuthService";
import ChatService from "./api/services/ChatService";
import PasswordService from "./api/services/PasswordService";
import UserService from "./api/services/UserService";
import { Message } from "./redux/reducers/UserReducer";

export const pageLinks = {
    login: "/login",
    signup: "/signup",
    dashboard: "/dashboard",
    profile: "/profile",
    homepage: "/",
    resetEmail: `/${PasswordService.API_BASE}email`,
    resetPassword: `/${PasswordService.API_BASE}reset`,
};

export const apiLinks = {
    baseUrl: (process.env.NODE_ENV === 'production') 
        ? "https://chatterus-backend.herokuapp.com/" 
        : "http://localhost:4000/",
    refreshToken: `${AuthService.API_BASE}refreshtoken`,
    profile: `${UserService.API_BASE}profile`,
    sendResetLink: `${PasswordService.API_BASE}email`,
    resetPassword: `${PasswordService.API_BASE}reset`,
    createChat: `${ChatService.API_BASE}newchat`,
    getAllUsers: `${UserService.API_BASE}all`
};

export const redux = {
    PENDING: "PENDING",
    SUCCESS: "SUCCESS",
    FAIL: "FAIL",
    UPDATE_USERNAME_OR_EMAIL: "UPDATE_USERNAME_OR_EMAIL",
    UPDATE_USERNAME: "UPDATE_USERNAME",
    UPDATE_EMAIL: "UPDATE_EMAIL",
    UPDATE_PASSWORD: "UPDATE_PASSWORD",
    UPDATE_CPASSWORD: "UPDATE_CPASSWORD",
    SET_USER: "SET_USER",
    SET_CHOSEN_CHAT: "SET_CHOSEN_CHAT",
    CHOOSE_CHAT: "CHOOSE_CHAT",
    SET_CHATS: "SET_CHATS",
    SET_ALL: "SET_ALL",
    SHOW_PROMPT: "SHOW_PROMPT",
    CLOSE_PROMPT: "CLOSE_PROMPT",
    ADD_CHAT: "ADD_CHAT",
    REMOVE_CHAT: "REMOVE_CHAT",
    UPDATE_CHAT: "UPDATE_CHAT",
};

export const prompt = {
    CREATE_CHAT: "CREATE_CHAT",
    ADD_USERS: "ADD_USERS",
    LEAVE_CHAT: "LEAVE_CHAT",
    UPDATE_CHAT: "UPDATE_CHAT",
    DELETE_CHAT: "DELETE_CHAT",
    DELETE_ACCOUNT: "DELETE_ACCOUNT"
}

export const socketEvents = {
    NON_ADMIN_UPDATE_CHAT: "NON_ADMIN_UPDATE_CHAT",
    ADMIN_UPDATE_CHAT: "ADMIN_UPDATE_CHAT",
    ON_JOIN_CHAT: "ON_JOIN_CHAT",
    SEND_MESSAGE_SUCCESS: "SEND_MESSAGE_SUCCESS",
    ON_DELETE_CHAT_ADMIN: "ON_DELETE_CHAT_ADMIN",
    ON_DELETE_CHAT_NON_ADMIN: "ON_DELETE_CHAT_NON_ADMIN",
    DELETE_CHAT_ERROR: "DELETE_CHAT_ERROR",
    LEAVE_CHAT: "LEAVE_CHAT",
};