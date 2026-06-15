import axios from "axios";

const API = import.meta.env.VITE_API_URL || "https://ai-traffic-backend-h4kt.onrender.com";

export const getLiveData = async () => {
    const response = await axios.get(`${API}/api/live`);
    return response.data;
};

export const getHistory = async () => {
    const response = await axios.get(`${API}/api/history`);
    return response.data;
};

export const getQTable = async () => {
    const response = await axios.get(`${API}/api/qtable`);
    return response.data;
};

export const getLogs = async () => {
    const response = await axios.get(`${API}/api/logs`);
    return response.data;
};