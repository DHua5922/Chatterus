import axios from "axios";
import { apiLinks } from "../constants";

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