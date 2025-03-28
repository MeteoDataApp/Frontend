import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.BACKEND_URL,
})

instance.interceptors.request.use((config) => {
    config.headers["content-type"] = "application/json";

    return config;
}, (err) => {
    return Promise.reject(err);
})

export default instance;