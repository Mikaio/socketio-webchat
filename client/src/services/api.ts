import axios from "axios";
import configs from "../configs/configs";

const api = axios.create({
    baseURL: `${configs.host}:${configs.port}`,
});

export default api;
