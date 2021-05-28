import axios from "axios";
import { apiLinks } from "../constants";
import AuthService from "./services/AuthService";

axios.interceptors.request.use(function (config) {
    // Modify request before it is sent
    if(config.url.indexOf(apiLinks.baseUrl) === -1)
        config.url = apiLinks.baseUrl + config.url;
    config.withCredentials = true;
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    // Try request again with new token
    if(error.response.status === 401) {
        return AuthService.refreshToken()
            .then(() => new Promise((resolve, reject) => (
                axios.request(error.config)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            )))
            .catch(error => Promise.reject(error));
    }
    
    // Reject request if token refresh didn't work
    if (error.config.url.includes(apiLinks.refreshToken)) {
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }

    return Promise.reject(error);
});