import axios from 'axios';

axios.defaults.withCredentials = true;

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY,
        'Content-Type': 'application/json',
        'Referer': process.env.NEXT_PUBLIC_APP_URL,
        "X-Requested-With": "XMLHttpRequest",
    },
});

// Helper to set token dynamically
export const setAxiosToken = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.Authorization;
    }
};

export default axiosInstance;
