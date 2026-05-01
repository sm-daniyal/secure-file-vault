// ============================================================
// api.js — Pre-configured Axios instance
// ============================================================
// All API calls in this app go through this instance so the
// JWT token is automatically attached to every request.
// ============================================================

import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Vite proxy forwards this to http://localhost:5000/api
});

// Attach the JWT token from localStorage to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vault_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
