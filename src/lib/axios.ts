// src/lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/", // adjust to your backend URL
  withCredentials: false, // if you're using cookies / auth
});

export default api;
