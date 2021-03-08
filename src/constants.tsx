import AuthService from "./api/services/AuthService";
import ChatService from "./api/services/ChatService";
import PasswordService from "./api/services/PasswordService";
import UserService from "./api/services/UserService";

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
    createChat: `${ChatService.API_BASE}newchat`
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
    CLOSE_PROMPT: "CLOSE_PROMPT"
};