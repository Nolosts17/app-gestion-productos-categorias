// src/axiosConfig.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/api', // URL correcta de tu API
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
