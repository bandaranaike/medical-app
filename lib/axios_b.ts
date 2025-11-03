import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g., https://api.myclinic.com
  withCredentials: true, // crucial for Sanctum cookies
});

export default api;
