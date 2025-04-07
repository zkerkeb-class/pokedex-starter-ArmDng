const API_BASE_URL = 'http://localhost:3000/api';
import axios from "axios";

const token = localStorage.getItem("token");

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Authorization: `Bearer ${token}`,
    }

})