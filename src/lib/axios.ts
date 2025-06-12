// src/lib/axios.ts
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl, // adjust to your backend URL
  withCredentials: false, // if you're using cookies / auth
});

export default api;
