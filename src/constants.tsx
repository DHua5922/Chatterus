export const pageLinks = {
    login: "/login",
    signup: "/signup",
    dashboard: "/dashboard",
};

export const apiLinks = {
    baseUrl: (process.env.NODE_ENV === 'production') 
        ? "https://chatterus-backend.herokuapp.com/" 
        : "http://localhost:4000/",
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
};