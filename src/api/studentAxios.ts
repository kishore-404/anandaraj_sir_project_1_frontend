// src/api/studentAxios.ts
import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios"; // ✅ type-only import

const studentAxios: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

studentAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("studentToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

export default studentAxios;
